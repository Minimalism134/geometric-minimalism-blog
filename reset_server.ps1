# Reset Server Script
# Usage: .\reset_server.ps1

$User = "root"
$IP = "47.122.118.253"
$Dest = "/var/www/geometric-blog"

Write-Host "=== NUKING SERVER DEPLOYMENT ==="

# Clean everything
$Command = "pkill -f gunicorn || true && rm -rf ${Dest} && rm -rf /tmp/geometric-* && echo 'Server Cleaned.'"

ssh "${User}@${IP}" $Command

Write-Host "Server has been reset. All project files and processes are removed."
