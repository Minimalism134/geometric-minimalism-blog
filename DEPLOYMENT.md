# 阿里云 ECS 部署指南 (Alibaba Cloud ECS Deployment)

本指南专门针对阿里云 ECS 服务器（Ubuntu/Debian 系统推荐）的部署流程。

## 1. 准备工作

### 1.1 购买/配置 ECS
1.  登录阿里云控制台，购买 ECS 实例。
2.  **操作系统**: 推荐选择 **Ubuntu 22.04 LTS** (本教程基于 Ubuntu 命令，CentOS 用户请替换 `apt` 为 `yum`)。
3.  **安全组 (Security Group)**: **非常重要！**
    -   进入 ECS 控制台 -> 安全组 -> 配置规则。
    -   确保入方向允许 **TCP 80** (HTTP) 和 **TCP 22** (SSH)。
    -   如果需要 HTTPS，还需要允许 **TCP 443**。

### 1.2 连接服务器
使用 SSH 工具 (如 Putty, Xshell 或终端) 连接到你的服务器:
```bash
ssh root@47.122.118.253
```

---

## 2. 环境安装

在服务器终端执行以下命令更新系统并安装必要软件：

```bash
# 更新软件源
sudo apt update

# 安装 Python3, Pip, Nginx, Git
sudo apt install -y python3-pip python3-venv nginx git

# 安装 Node.js (推荐使用 nvm 或直接安装 LTS 版本)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v
python3 --version
nginx -v
```

---

## 3. 代码部署

### 3.1 获取代码
将你的代码上传到服务器。你可以使用 Git Clone (如果你的代码在 GitHub/Gitee):
```bash
cd /opt
git clone <你的仓库地址> project
cd project
```
*或者使用 SFTP 工具直接将本地文件夹上传到服务器的 `/opt/project` 目录。*

---

### 3.2 后端配置 (Flask + Gunicorn)

1.  **进入后端目录并设置虚拟环境**:
    ```bash
    cd /opt/project/backend
    python3 -m venv venv
    source venv/bin/activate
    ```

2.  **安装依赖**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **配置环境变量**:
    创建 `.env` 文件并填入你的 API Key:
    ```bash
    nano .env
    ```
    写入内容:
    ```env
    SILICONFLOW_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
    ```
    *(按 Ctrl+X, 然后 Y, 然后 Enter 保存)*

4.  **测试运行**:
    ```bash
    # 尝试运行一下看有没有报错
    gunicorn app:app -b 0.0.0.0:5000
    ```
    *如果看到启动成功的日志，按 Ctrl+C 停止。*

5.  **后台运行**:
    使用 `nohup` 让它在后台运行 (简易模式):
    ```bash
    nohup gunicorn app:app -b 127.0.0.1:5000 --access-logfile access.log --error-logfile error.log &
    ```
    *注: 生产环境建议编写 Systemd 服务文件。*

---

### 3.3 前端配置 (Vue + Nginx)

1.  **构建前端**:
    回到项目根目录并安装依赖构建:
    ```bash
    cd /opt/project
    npm install
    
    npm run build
    ```
    *注意：代码已配置为在生产环境自动使用相对路径 `/api`，配合下文的 Nginx 反向代理配置，前端请求会自动转发给后端，无需手动设置环境变量。*
    构建完成后，你会看到一个 `dist` 文件夹。

    **关键步骤：上传静态文件**
    如果你是在本地电脑执行的构建，需要将 `dist` 文件夹上传到服务器：
    ```bash
    # 在本地终端执行 (替换 <你的公网IP>)
    scp -r dist root@47.122.118.253:/opt/project/
    ```
    *确保服务器上的 `/opt/project/dist` 目录是最新的构建结果。*

2.  **配置 Nginx**:
    编辑 Nginx 配置文件:
    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```
    
    将其内容清空并替换为以下内容 (注意修改 `root` 路径):

    ```nginx
    server {
        listen 80;
        server_name _;  # 如果有域名，这里填域名

        # 前端静态文件
        location / {
            root /opt/project/dist; # 确保指向你的 dist 目录
            index index.html;
            try_files $uri $uri/ /index.html; # Vue Router History 模式必须
        }

        # 后端 API 反向代理
        location /api/ {
            proxy_pass http://127.0.0.1:5000; # 转发给 Gunicorn
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
    ```

3.  **重启 Nginx**:
    ```bash
    sudo nginx -t  # 检查配置是否有误
    sudo systemctl restart nginx
    ```

---

## 4. 完成验证

1.  打开浏览器，访问 `http://47.122.118.253`。
2.  你应该能看到博客首页。
3.  点击右下角 AI 助手，测试对话功能。如果回答正常，说明后端代理成功。

## 常见问题排查

*   **访问不了?**
    *   检查阿里云控制台【安全组】是否开放了 80 端口。
    *   检查 Nginx 是否运行: `systemctl status nginx`。
*   **AI 报错 "Network Error"?**
    *   检查 Gunicorn 是否在后台运行: `ps aux | grep gunicorn`。0
    *   检查 Nginx 反向代理配置中的 `proxy_pass` 端口是否与 Gunicorn 端口一致。
*   **页面刷新 404?**
    *   确保 Nginx 配置中加了 `try_files $uri $uri/ /index.html;`。