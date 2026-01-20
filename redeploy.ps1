# Redeploy Script: Clean & Fresh Install
# Usage: .\redeploy.ps1

$User = "root"
$IP = "47.122.118.253"
$Dest = "/var/www/geometric-blog" 

Write-Host "=== Starting Clean Redeployment ==="

# 1. Stop Services & Cleanup Remote Server
Write-Host "[1/5] Stopping Service & Cleaning Server..."
# Kill gunicorn and remove the entire project directory
$CleanCommand = "pkill -f gunicorn || true && rm -rf ${Dest} && echo 'Server cleaned.'"
ssh "${User}@${IP}" $CleanCommand

# 2. Build Frontend
Write-Host "[2/5] Building Frontend..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
    exit 1
}

# 3. Create Remote Directories
Write-Host "[3/5] Re-creating Directories..."
ssh "${User}@${IP}" "mkdir -p ${Dest}/dist ${Dest}/backend"

# 4. Upload Files
Write-Host "[4/5] Uploading Files..."
scp -r dist/* "${User}@${IP}:${Dest}/dist"
scp -r backend/* "${User}@${IP}:${Dest}/backend"
# Upload env if exists
if (Test-Path ".env.local") {
    scp .env.local "${User}@${IP}:${Dest}/backend/.env"
}

# 5. Setup & Start Backend
Write-Host "[5/5] Re-installing & Starting Backend..."
# Create venv, install deps, start server
$StartCommand = "cd ${Dest}/backend && python3 -m venv venv && ./venv/bin/pip install -r requirements.txt && nohup ./venv/bin/gunicorn -w 2 -b 0.0.0.0:5000 app:app > app.log 2>&1 & echo 'Fresh deployment started.'"
ssh "${User}@${IP}" $StartCommand

Write-Host "=== Clean Redeployment Successful! ==="
Write-Host "Backend: http://$IP:5000"
