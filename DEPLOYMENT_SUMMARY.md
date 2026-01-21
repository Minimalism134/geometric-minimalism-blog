# 阿里云部署复盘与总结 (Geometric Minimalism Blog)

本文档详细记录了 `Geometric Minimalism Blog` 项目部署到阿里云服务器（Ubuntu）的全过程，特别关注了在部署过程中遇到的实际问题、根本原因分析及最终解决方案。

## 1. 部署架构概览

最终确定的生产环境架构如下：

-   **服务器**: 阿里云 ECS (Ubuntu 24.04/Noble)
-   **前端**: Vue 3 + Vite (构建为静态文件 `dist`)
-   **后端**: Python Flask (API 服务)
-   **Web 服务器 (Nginx)**:
    -   80 端口: 托管前端静态文件 (`/var/www/geometric-blog/dist`)
    -   反向代理: 将 `/api` 请求转发至后端 (`127.0.0.1:5000`)
-   **应用服务器 (Gunicorn)**: 运行 Flask 应用
-   **进程管理**: `nohup` (后台运行)

---

## 2. 部署过程遇到的挑战与解决方案

### 🔴 挑战一：Windows 与 Linux 的换行符冲突 (`\r` Error)

**现象**:
在通过 PowerShell 远程执行多行 SSH 命令时，服务器报错：
```bash
bash: line 1: $'\r': command not found
bash: line 2: cd: $'/var/www/geometric-blog/backend\r': No such file or directory
```

**原因**:
Windows 系统使用 `CRLF` (`\r\n`) 作为换行符，而 Linux 仅使用 `LF` (`\n`)。当通过 SSH 传递包含 Windows 换行符的脚本字符串时，Linux Shell 无法正确解析路径和命令。

**解决方案**:
-   **单行命令化**: 将多行 Shell 脚本合并为单行，使用 `&&` 连接。
-   **示例**:
    ```powershell
    # 错误 (多行字符串)
    $Cmd = "
      cd /app
      ls
    "
    # 正确 (单行)
    $Cmd = "cd /app && ls"
    ```

### 🔴 挑战二：SSH 主机指纹变更 (Host Key Verification Failed)

**现象**:
重置服务器系统后，本地运行脚本报错：
```text
Host key verification failed.
```

**原因**:
服务器重装系统后生成了新的 SSH 主机密钥 (Host Key)，与本地 `known_hosts` 文件中记录的旧指纹不匹配，触发安全拦截。

**解决方案**:
-   清除本地旧指纹：
    ```powershell
    ssh-keygen -R 47.122.118.253
    ```

### 🔴 挑战三：Python 依赖安装失败与 502 Bad Gateway

**现象**:
-   访问 API 返回 `502 Bad Gateway`。
-   后端日志报错 `ModuleNotFoundError: No module named 'flask'`。
-   Gunicorn 启动失败。

**原因**:
国内服务器访问官方 PyPI 源 (`pypi.org`) 极慢或超时，导致 `pip install -r requirements.txt` 中途失败，虚拟环境 (`venv`) 不完整。

**解决方案**:
-   **使用阿里云镜像源**: 强制 pip 使用国内镜像。
    ```bash
    ./venv/bin/pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/
    ```
-   **系统级依赖**: 确保安装了 `python3-venv` (`apt-get install python3-venv`)。

### 🔴 挑战四：国内网络环境下的静态资源加载 (ERR_CONNECTION_RESET)

**现象**:
网页能打开，但样式错乱或控制台红字报错：
-   `cdn.tailwindcss.com` 连接重置。
-   `fonts.googleapis.com` 连接重置。

**原因**:
Google Fonts 和部分国外 CDN 在中国大陆地区无法正常访问。

**解决方案**:
1.  **Tailwind CSS**: 移除 CDN 引用，改为本地构建 (npm build)，将 CSS 打包进项目。
2.  **Google Fonts**: 替换为国内镜像源 (如 `fonts.font.im`)。
    ```html
    <!-- 替换前 -->
    href="https://fonts.googleapis.com/css2..."
    <!-- 替换后 -->
    href="https://fonts.font.im/css2..."
    ```

### 🔴 挑战五：Nginx 缺失与配置

**现象**:
服务器全盘重置后，80 端口拒绝连接。

**原因**:
裸机系统未安装 Nginx。

**解决方案**:
编写自动化脚本 `deploy_nginx.ps1`：
1.  `apt-get install -y nginx`
2.  上传 `nginx.conf`
3.  建立软链接并重载服务。

---

## 3. 运维脚本清单

为了简化后续运维，我们建立了一套 PowerShell 自动化工具库：

| 脚本文件 | 作用 |
| :--- | :--- |
| `deploy.ps1` | **初始部署**：上传代码、安装依赖、启动服务。 |
| `redeploy.ps1` | **完全重部署**：清理旧文件，重新构建并部署全栈。 |
| `update_frontend.ps1` | **仅更新前端**：只构建上传 dist 目录（快速修复 UI/字体）。 |
| `restart_backend.ps1` | **重启后端**：重启 Gunicorn 服务。 |
| `fix_backend_deps.ps1` | **修复依赖**：使用阿里云镜像重装 Python 依赖（救火用）。 |
| `deploy_nginx.ps1` | **配置 Nginx**：安装 Nginx 并更新站点配置。 |
| `reset_server.ps1` | **重置服务器**：(慎用) 删除所有项目文件。 |

## 4. 总结

本次部署从“裸机”开始，经历了一次完整的全栈部署流程。关键经验在于：
1.  **网络本地化**：在国内服务器部署，必须优先考虑 pip 镜像源和前端静态资源（字体/CDN）的可访问性。
2.  **脚本健壮性**：跨平台脚本（Windows -> Linux）需格外注意换行符问题，尽量使用单行命令或标准化的 CI/CD 工具。
3.  **分层修复**：当出现问题（如 502）时，应区分是 Nginx 配置问题还是后端进程崩溃。先保证后端能独立运行（手动启动验证），再排查反向代理。
