# Fix Backend Dependencies Script
# Usage: .\fix_backend_deps.ps1

$User = "root"
$IP = "47.122.118.253"
$AppDir = "/var/www/geometric-blog/backend"

Write-Host "=== Re-installing Backend Dependencies ==="

# Command: Remove venv, recreate it, install using Aliyun mirror, start gunicorn
$Command = "cd ${AppDir} && pkill -f gunicorn || true && echo '[1] Removing old venv...' && rm -rf venv && echo '[2] Creating new venv...' && python3 -m venv venv && echo '[3] Installing deps from Aliyun mirror...' && ./venv/bin/pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/ && echo '[4] Starting Gunicorn...' && nohup ./venv/bin/gunicorn -w 2 -b 0.0.0.0:5000 app:app > app.log 2>&1 & echo 'Backend fixes applied and started.'"

ssh "${User}@${IP}" $Command
