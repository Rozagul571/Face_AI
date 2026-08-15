#!/bin/bash
# === Serverda EC2 Instance Connect terminalida ishlatish uchun ===
# Bu buyruqlarni AWS brauzer terminaliga kiriting

set -e

echo "=== Derion AI Server Setup ==="

# 1. Eski proyektni o'chirish
echo "[1] Stopping old projects..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
sudo rm -rf /home/ubuntu/smart-guardian /home/ubuntu/ivms /home/ubuntu/face-ai /var/www/html/* 2>/dev/null || true

# 2. Node.js o'rnatish (agar yo'q bo'lsa)
if ! command -v node &>/dev/null; then
  echo "[2] Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "[2] Node $(node --version) already installed"
fi

# 3. PM2 o'rnatish
if ! command -v pm2 &>/dev/null; then
  echo "[3] Installing PM2..."
  sudo npm install -g pm2
fi

# 4. Git o'rnatish (agar yo'q bo'lsa)
sudo apt-get install -y git 2>/dev/null || true

echo ""
echo "=== Server ready! Now transfer the project ==="
echo "Waiting for project upload..."
