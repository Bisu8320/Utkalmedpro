#!/bin/bash

# AWS EC2 Setup Script for Utkal Medpro
# This script sets up the production environment on an AWS EC2 instance

set -e

echo "🚀 Setting up Utkal Medpro on AWS EC2..."

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install -y nginx

# Install certbot for SSL certificates
sudo apt install -y certbot python3-certbot-nginx

# Create application directory
sudo mkdir -p /var/www/utkal-medpro
sudo chown -R $USER:$USER /var/www/utkal-medpro

# Clone or copy your application files here
# git clone https://github.com/your-username/utkal-medpro.git /var/www/utkal-medpro

echo "✅ Basic setup completed!"
echo "📝 Next steps:"
echo "1. Copy your application files to /var/www/utkal-medpro"
echo "2. Configure environment variables"
echo "3. Install dependencies and build the application"
echo "4. Configure Nginx"
echo "5. Set up SSL certificates"