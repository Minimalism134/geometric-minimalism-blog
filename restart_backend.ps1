# Restart Backend Script
# Usage: .\restart_backend.ps1

$User = "root"
$IP = "47.122.118.253"
$AppDir = "/var/www/geometric-blog/backend"

Write-Host "=== Restarting Backend Service ==="

$Command = "cd ${AppDir} && pkill -f gunicorn || true && if [ ! -d 'venv' ]; then python3 -m venv venv && ./venv/bin/pip install -r requirements.txt; fi && nohup ./venv/bin/gunicorn -w 2 -b 0.0.0.0:5000 app:app > app.log 2>&1 & echo 'Backend started.' && sleep 2 && ps aux | grep gunicorn && echo '--- Log Tail ---' && tail -n 10 app.log"

ssh "${User}@${IP}" $Command
