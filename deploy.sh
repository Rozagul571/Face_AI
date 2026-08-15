#!/bin/bash
# Derion AI - Full Deploy Script
# Run: ./deploy.sh
# Requires: hackathon-server-key.pem in same directory

set -e

SERVER="16.171.0.251"
USER="ubuntu"
KEY="./hackathon-server-key.pem"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║      Derion AI - Server Deploy       ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Check key file
if [ ! -f "$KEY" ]; then
  echo "ERROR: $KEY not found!"
  exit 1
fi
chmod 400 "$KEY"

# Test connection
echo "▶ Testing SSH connection..."
ssh -i "$KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$USER@$SERVER" "echo 'SSH OK'" 2>/dev/null || {
  echo ""
  echo "ERROR: Cannot connect to server!"
  echo "Fix: AWS Console → Security Groups → Add SSH from 0.0.0.0/0"
  exit 1
}

# Build
echo "▶ Building project..."
npm run build

# Pack
echo "▶ Creating package..."
tar --exclude='./node_modules' \
    --exclude='./.git' \
    --exclude='./.next/cache' \
    --exclude='./hackathon-server-key.pem' \
    --exclude='./deploy.sh' \
    --exclude='./server-setup.sh' \
    -czf /tmp/face-ai.tar.gz .
echo "  Package: $(du -sh /tmp/face-ai.tar.gz | cut -f1)"

# Upload
echo "▶ Uploading to server..."
scp -i "$KEY" -o StrictHostKeyChecking=no /tmp/face-ai.tar.gz "$USER@$SERVER:/tmp/face-ai.tar.gz"

# Deploy on server
echo "▶ Deploying on server..."
ssh -i "$KEY" -o StrictHostKeyChecking=no "$USER@$SERVER" << 'REMOTE'
set -e

# Install Node.js if missing
if ! command -v node &>/dev/null; then
  echo "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - 2>/dev/null
  sudo apt-get install -y nodejs 2>/dev/null
fi

# Install PM2 if missing
if ! command -v pm2 &>/dev/null; then
  echo "Installing PM2..."
  sudo npm install -g pm2 2>/dev/null
fi

# Remove old projects
echo "Removing old projects..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
sudo rm -rf /var/www/* 2>/dev/null || true
sudo rm -rf /home/ubuntu/smart-guardian 2>/dev/null || true
sudo rm -rf /home/ubuntu/ivms 2>/dev/null || true
sudo rm -rf /home/ubuntu/face-ai 2>/dev/null || true

# Extract new project
echo "Extracting project..."
mkdir -p /home/ubuntu/face-ai
cd /home/ubuntu/face-ai
tar -xzf /tmp/face-ai.tar.gz

# Install dependencies
echo "Installing dependencies..."
npm install --production 2>/dev/null

# Configure nginx to proxy port 80 → 3000
echo "Configuring nginx..."
sudo tee /etc/nginx/sites-available/face-ai > /dev/null << 'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

sudo rm -f /etc/nginx/sites-enabled/*
sudo ln -sf /etc/nginx/sites-available/face-ai /etc/nginx/sites-enabled/face-ai
sudo nginx -t && sudo systemctl reload nginx

# Start app
echo "Starting app..."
cd /home/ubuntu/face-ai
pm2 start npm --name "face-ai" -- start
pm2 save
sudo pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null | tail -1 | bash 2>/dev/null || true

echo ""
echo "✓ Deployed successfully!"
pm2 status
REMOTE

echo ""
echo "╔══════════════════════════════════════╗"
echo "║  ✓ DONE! Site live at:              ║"
echo "║  http://16.171.0.251                ║"
echo "╚══════════════════════════════════════╝"
