# AWS Deployment Guide for Utkal Medpro

This guide will help you deploy the Utkal Medpro healthcare application to AWS.

## Prerequisites

Before you begin, you'll need:

1. **AWS Account** with appropriate permissions
2. **Domain name** (e.g., utkalmedpro.com)
3. **AWS CLI** installed and configured
4. **SSH Key Pair** in your AWS region

## What You Need to Provide

### 1. AWS Account Setup
- AWS Account with billing enabled
- IAM user with necessary permissions (EC2, S3, CloudFormation, Route53)
- AWS CLI configured with your credentials

### 2. Domain Configuration
- Purchase a domain name (recommended: utkalmedpro.com)
- Configure DNS to point to AWS (we'll provide the IP after deployment)

### 3. SSL Certificate
- We'll use Let's Encrypt for free SSL certificates
- Alternatively, you can use AWS Certificate Manager

### 4. Environment Variables
You'll need to provide values for these environment variables:

```bash
# Database (if using external database)
DATABASE_URL="your-database-connection-string"

# SMS Service (choose one)
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="your-twilio-phone"

# Email Service
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# JWT Secret (generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-here"

# AWS Configuration (will be auto-configured)
AWS_REGION="us-east-1"
AWS_S3_BUCKET="will-be-created-automatically"
```

## Deployment Steps

### Step 1: Deploy Infrastructure

1. **Upload CloudFormation Template**
   ```bash
   aws cloudformation create-stack \
     --stack-name utkal-medpro-infrastructure \
     --template-body file://aws/cloudformation.yaml \
     --parameters ParameterKey=KeyPairName,ParameterValue=your-key-pair \
                  ParameterKey=DomainName,ParameterValue=utkalmedpro.com \
                  ParameterKey=InstanceType,ParameterValue=t3.small \
     --capabilities CAPABILITY_IAM
   ```

2. **Wait for stack creation** (5-10 minutes)
   ```bash
   aws cloudformation wait stack-create-complete --stack-name utkal-medpro-infrastructure
   ```

3. **Get the public IP address**
   ```bash
   aws cloudformation describe-stacks \
     --stack-name utkal-medpro-infrastructure \
     --query 'Stacks[0].Outputs[?OutputKey==`PublicIP`].OutputValue' \
     --output text
   ```

### Step 2: Configure Domain DNS

Point your domain to the public IP address:
- Create an A record: `utkalmedpro.com` → `YOUR_PUBLIC_IP`
- Create an A record: `www.utkalmedpro.com` → `YOUR_PUBLIC_IP`

### Step 3: Deploy Application

1. **Connect to your EC2 instance**
   ```bash
   ssh -i your-key-pair.pem ec2-user@YOUR_PUBLIC_IP
   ```

2. **Clone your repository**
   ```bash
   cd /var/www/utkal-medpro
   git clone https://github.com/your-username/utkal-medpro.git .
   ```

3. **Set up environment variables**
   ```bash
   # Copy and edit environment files
   cp .env.example .env
   cp backend/.env.example backend/.env
   
   # Edit the files with your actual values
   nano .env
   nano backend/.env
   ```

4. **Install dependencies and build**
   ```bash
   npm install
   npm run build
   npm run backend:build
   ```

5. **Configure PM2**
   ```bash
   pm2 start aws/pm2.config.js
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx**
   ```bash
   sudo cp aws/nginx.conf /etc/nginx/sites-available/utkal-medpro
   sudo ln -s /etc/nginx/sites-available/utkal-medpro /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Set up SSL certificate**
   ```bash
   sudo certbot --nginx -d utkalmedpro.com -d www.utkalmedpro.com
   ```

### Step 4: Configure Monitoring

1. **Set up CloudWatch monitoring**
   ```bash
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
   ```

2. **Configure log rotation**
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 30
   ```

## Ongoing Maintenance

### Automated Deployments
Use the `aws/deploy.sh` script for future deployments:
```bash
chmod +x aws/deploy.sh
./aws/deploy.sh
```

### Monitoring
- **Application logs**: `pm2 logs`
- **Nginx logs**: `sudo tail -f /var/log/nginx/error.log`
- **System monitoring**: AWS CloudWatch dashboard

### Backup Strategy
- **Database**: Automated daily backups (if using RDS)
- **Application files**: Automated backups before each deployment
- **User uploads**: S3 versioning enabled

## Cost Estimation

**Monthly AWS costs (approximate):**
- EC2 t3.small: $15-20/month
- S3 storage: $1-5/month
- Data transfer: $1-10/month
- **Total: $17-35/month**

## Security Features

- ✅ HTTPS with SSL certificates
- ✅ Security headers configured
- ✅ Private subnets for database
- ✅ IAM roles with minimal permissions
- ✅ Security groups with restricted access
- ✅ Encrypted S3 storage
- ✅ Regular security updates

## Support

For deployment assistance, contact:
- Email: support@utkalmedpro.com
- Phone: +91 7064055180

## Troubleshooting

### Common Issues

1. **SSL certificate issues**
   ```bash
   sudo certbot renew --dry-run
   ```

2. **Application not starting**
   ```bash
   pm2 logs utkal-medpro-backend
   ```

3. **Nginx configuration errors**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

4. **Database connection issues**
   - Check environment variables
   - Verify security group rules
   - Test database connectivity