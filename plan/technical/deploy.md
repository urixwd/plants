# Linode Server Setup Guide

## 1. Create Linode Instance
- **Plan**: Nanode 1GB ($5/month)
- **Image**: Ubuntu 22.04 LTS
- **Region**: Choose closest to you
- **Root Password**: Set strong password
- **SSH Keys**: Add your public key (recommended)

## 2. Initial Server Setup

### Connect to server
```bash
ssh root@your-server-ip
```

### Update system
```bash
apt update && apt upgrade -y
```

### Create non-root user
```bash
adduser plants
usermod -aG sudo plants
```

### Switch to new user
```bash
su - plants
```

## 3. Install Required Software

### Install Bun (preferred runtime)
```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

### Install pnpm
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
```

### Fallback: Install Node.js 20 (if Bun issues)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Verify installation
```bash
bun --version    # Should show latest Bun version
pnpm --version   # Should show latest pnpm version
```

### Install PM2 globally
```bash
pnpm add -g pm2
# or with bun: bun add -g pm2
```

### Install Git
```bash
sudo apt install git -y
```

## 4. Setup Project

### Clone your repository
```bash
cd ~/
git clone https://github.com/yourusername/house-plants.git
cd house-plants
```

### Install dependencies
```bash
pnpm install
```

### Run database migrations
```bash
pnpm run migrate
```

### Build the project
```bash
pnpm run build
```

## 5. Setup PM2 Process Manager

### Start the app with PM2 (using Bun)
```bash
pm2 start bun --name "plants-app" -- start
```

### Alternative with Node.js
```bash
pm2 start pnpm --name "plants-app" -- start
```

### Save PM2 configuration
```bash
pm2 save
pm2 startup
# Follow the instructions PM2 gives you (copy/paste the command)
```

### Useful PM2 commands
```bash
pm2 status           # Check app status
pm2 logs plants-app  # View logs
pm2 restart plants-app  # Restart app
pm2 stop plants-app  # Stop app
pm2 delete plants-app   # Delete app from PM2
```

## 6. Setup Nginx (Optional but Recommended)

### Install Nginx
```bash
sudo apt install nginx -y
```

### Create config file
```bash
sudo nano /etc/nginx/sites-available/plants-app
```

### Nginx config content
```nginx
server {
    listen 80;
    server_name your-domain.com;  # or your-server-ip

    location / {
        proxy_pass http://localhost:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/plants-app /etc/nginx/sites-enabled/
sudo nginx -t  # Test config
sudo systemctl restart nginx
```

## 7. Firewall Setup

### Setup UFW firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 8. Deployment Workflow

### Update and restart app
```bash
cd ~/house-plants
git pull origin main
pnpm install  # If package.json changed
pnpm run migrate  # Apply new migrations
pnpm run build
pm2 restart plants-app
```

### One-liner deployment script
```bash
# Create deploy.sh
echo "#!/bin/bash
cd ~/house-plants
git pull origin main
pnpm install
pnpm run migrate
pnpm run build
pm2 restart plants-app
echo 'Deployment complete!'" > deploy.sh

chmod +x deploy.sh
```

### Run deployment
```bash
./deploy.sh
```

## 9. Monitoring

### Check if app is running
```bash
curl http://localhost:3100
pm2 status
```

### View logs
```bash
pm2 logs plants-app --lines 50
```

### Monitor system resources
```bash
htop  # Install with: sudo apt install htop
```

## 10. SSL Setup (Optional)

### Install Certbot for free SSL
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

This will automatically configure SSL and renew certificates.