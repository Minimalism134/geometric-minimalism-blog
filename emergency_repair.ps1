# Emergency Backend Fix
# Usage: .\emergency_repair.ps1

$User = "root"
$IP = "47.122.118.253"
$AppDir = "/var/www/geometric-blog/backend"

Write-Host "=== Emergency Repair: Step-by-Step ==="

# 1. Install System Dependencies
Write-Host "[1/4] Installing python3-venv..."
ssh "${User}@${IP}" "apt-get update && apt-get install -y python3-venv python3-full"

# 2. Reset Virtual Env
Write-Host "[2/4] Re-creating VENV..."
ssh "${User}@${IP}" "cd ${AppDir} && rm -rf venv && python3 -m venv venv"

# 3. Install Minimal Deps
Write-Host "[3/4] Installing Flask & Gunicorn (Aliyun Mirror)..."
$InstallCmd = "cd ${AppDir} && ./venv/bin/pip install flask flask-cors gunicorn openai python-dotenv -i https://mirrors.aliyun.com/pypi/simple/"
ssh "${User}@${IP}" $InstallCmd

# 4. Start Gunicorn
Write-Host "[4/4] Starting Service..."
$StartCmd = "cd ${AppDir} && nohup ./venv/bin/gunicorn -w 2 -b 0.0.0.0:5000 app:app > app.log 2>&1 &"
ssh "${User}@${IP}" $StartCmd

Write-Host "=== Repair Complete. Check Website. ==="
