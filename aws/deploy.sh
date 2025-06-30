#!/bin/bash

# Deployment script for Utkal Medpro on AWS EC2
# Run this script to deploy updates to your production server

set -e

APP_DIR="/var/www/utkal-medpro"
BACKUP_DIR="/var/backups/utkal-medpro"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment of Utkal Medpro..."

# Create backup directory if it doesn't exist
sudo mkdir -p $BACKUP_DIR

# Backup current deployment
echo "📦 Creating backup..."
sudo cp -r $APP_DIR $BACKUP_DIR/backup_$TIMESTAMP

# Navigate to application directory
cd $APP_DIR

# Pull latest changes (if using git)
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Build backend
echo "🏗️ Building backend..."
npm run backend:build

# Restart backend with PM2
echo "🔄 Restarting backend..."
pm2 restart utkal-medpro-backend

# Reload Nginx configuration
echo "🔄 Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

# Health check
echo "🏥 Performing health check..."
sleep 5
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
    echo "🔄 Rolling back..."
    sudo rm -rf $APP_DIR
    sudo cp -r $BACKUP_DIR/backup_$TIMESTAMP $APP_DIR
    pm2 restart utkal-medpro-backend
    exit 1
fi

# Clean up old backups (keep last 5)
echo "🧹 Cleaning up old backups..."
sudo ls -t $BACKUP_DIR | tail -n +6 | xargs -r -I {} sudo rm -rf $BACKUP_DIR/{}

echo "✅ Deployment completed successfully!"
echo "🌐 Your application is now live at https://your-domain.com"