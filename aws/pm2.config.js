// PM2 Configuration for Utkal Medpro Backend
module.exports = {
  apps: [
    {
      name: 'utkal-medpro-backend',
      script: './backend/dist/server.js',
      cwd: '/var/www/utkal-medpro',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      // Restart policy
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      
      // Logging
      log_file: '/var/log/pm2/utkal-medpro-combined.log',
      out_file: '/var/log/pm2/utkal-medpro-out.log',
      error_file: '/var/log/pm2/utkal-medpro-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Monitoring
      monitoring: false,
      
      // Auto restart on file changes (disable in production)
      watch: false,
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Health check
      health_check_grace_period: 3000
    }
  ]
}