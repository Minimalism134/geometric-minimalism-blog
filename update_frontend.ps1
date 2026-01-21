# Update Frontend Only Script
# Usage: .\update_frontend.ps1

$User = "root"
$IP = "47.122.118.253"
$Dest = "/var/www/geometric-blog/dist"

Write-Host "=== Updating Frontend Only ==="

# 1. Build Frontend
Write-Host "[1/2] Building Frontend..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
    exit 1
}

# 2. Upload Files
Write-Host "[2/2] Uploading new dist..."
# Using scp to overwrite existing files
scp -r dist/* "${User}@${IP}:${Dest}"

Write-Host "=== Frontend Updated successfully! ==="
Write-Host "Fonts and UI should now be fixed."
