#!/bin/bash
# Run this on the server via EC2 Instance Connect or SSH
# Command: curl -fsSL https://raw.githubusercontent.com/Rozagul571/Face_AI/main/server-setup.sh | bash

set -e

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   Derion AI - Server Setup & Deploy      ║"
echo "╚══════════════════════════════════════════╝"

# ── 1. Swap (t3.micro uchun build xotira) ──
echo ""
echo "[1/6] Setting up swap memory..."
if [ ! -f /swapfile ]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab > /dev/null
  echo "  ✓ 2GB swap created"
else
  echo "  ✓ Swap already exists"
fi

# ── 2. Node.js ──
echo ""
echo "[2/6] Installing Node.js 20..."
if ! command -v node &>/dev/null || [[ "$(node --version)" != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - 2>/dev/null
  sudo apt-get install -y nodejs 2>/dev/null
fi
echo "  ✓ Node $(node --version)"

# ── 3. PM2 ──
echo ""
echo "[3/6] Installing PM2..."
if ! command -v pm2 &>/dev/null; then
  sudo npm install -g pm2 2>/dev/null
fi
echo "  ✓ PM2 $(pm2 --version)"

# ── 4. Eski proyektlarni o'chirish ──
echo ""
echo "[4/6] Removing old projects..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
sudo rm -rf /home/ubuntu/smart-guardian \
            /home/ubuntu/ivms \
            /home/ubuntu/face-ai \
            /home/ubuntu/project \
            /var/www/html 2>/dev/null || true
echo "  ✓ Old projects removed"

# ── 5. Face AI proyektini yuklash va build ──
echo ""
echo "[5/6] Cloning and building Face AI..."
cd /home/ubuntu
git clone https://github.com/Rozagul571/Face_AI.git face-ai 2>/dev/null || {
  cd face-ai && git pull origin main
}
cd /home/ubuntu/face-ai
npm install 2>/dev/null
NODE_OPTIONS="--max-old-space-size=512" npm run build

# ── 6. Nginx + PM2 ──
echo ""
echo "[6/6] Configuring nginx and starting app..."

# Nginx config
sudo tee /etc/nginx/sites-available/face-ai > /dev/null << 'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    client_max_body_size 20M;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

sudo rm -f /etc/nginx/sites-enabled/*
sudo ln -sf /etc/nginx/sites-available/face-ai /etc/nginx/sites-enabled/face-ai
sudo nginx -t 2>/dev/null && sudo systemctl reload nginx
echo "  ✓ Nginx configured"

# PM2 start
cd /home/ubuntu/face-ai
pm2 start npm --name "face-ai" -- start 2>/dev/null
pm2 save 2>/dev/null
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null | tail -1 | bash 2>/dev/null || true
echo "  ✓ App started with PM2"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  ✓ DONE! Site is live at:               ║"
echo "║                                          ║"
echo "║     http://16.171.0.251                  ║"
echo "╚══════════════════════════════════════════╝"
echo ""
pm2 status
