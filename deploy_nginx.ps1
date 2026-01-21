# Deploy Nginx Config Script
# Usage: .\deploy_nginx.ps1

$User = "root"
$IP = "47.122.118.253"
$NginxConf = "nginx.conf"
$RemoteConfPath = "/etc/nginx/sites-available/geometric-blog"
$SymLinkPath = "/etc/nginx/sites-enabled/geometric-blog"

Write-Host "=== Deploying Nginx Configuration ==="

# 1. Install Nginx if missing
Write-Host "[1/4] Installing Nginx..."
ssh "${User}@${IP}" "apt-get update && apt-get install -y nginx"

# 2. Upload nginx.conf to a temp location first
Write-Host "[2/4] Uploading config..."
scp $NginxConf "${User}@${IP}:/tmp/nginx.conf"

# 3. Move to Nginx dir, Enable site, and Reload
Write-Host "[3/4] Configuring & Reloading Nginx..."
$ConfigCommand = "mv /tmp/nginx.conf ${RemoteConfPath} && ln -sf ${RemoteConfPath} ${SymLinkPath} && rm -f /etc/nginx/sites-enabled/default && nginx -t && service nginx reload"
ssh "${User}@${IP}" $ConfigCommand

Write-Host "=== Nginx Deployed Successfully! ==="
Write-Host "Site: http://$IP"
