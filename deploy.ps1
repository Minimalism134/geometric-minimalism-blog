# Deployment Script to Aliyun
# Usage: .\deploy.ps1

$User = "root"
$IP = "47.122.118.253"
$Dest = "/var/www/geometric-blog" 

Write-Host "=== Starting Deployment ==="

# 1. Build Frontend
Write-Host "[1/4] Building Frontend..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
    exit 1
}

# 2. Create Remote Directories
Write-Host "[2/4] Preparing Remote Directories..."
ssh $User@$IP "mkdir -p $Dest/dist $Dest/backend"

# 3. Upload Files
Write-Host "[3/4] Uploading Files..."
# Upload Frontend dist
scp -r dist/* "${User}@${IP}:${Dest}/dist"
# Upload Backend code
scp -r backend/* "${User}@${IP}:${Dest}/backend"
# Upload Environment variables (optional, assuming .env.local exists locally)
if (Test-Path ".env.local") {
    scp .env.local "${User}@${IP}:${Dest}/backend/.env"
}

# 4. Restart Backend Service
Write-Host "[4/4] Updating & Restarting Backend..."
# Use a single-line string to avoid \r issues passed via SSH from Windows
$RemoteCommand = "cd ${Dest}/backend && python3 -m venv venv && ./venv/bin/pip install -r requirements.txt && pkill -f gunicorn || true && nohup ./venv/bin/gunicorn -w 2 -b 0.0.0.0:5000 app:app > app.log 2>&1 & echo 'Backend restarted.'"

ssh "${User}@${IP}" $RemoteCommand

Write-Host "=== Deployment Successful! ==="
Write-Host "Frontend: $Dest/dist"
Write-Host "Backend: http://$IP:5000"
