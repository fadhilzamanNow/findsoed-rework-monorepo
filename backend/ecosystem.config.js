module.exports = {
  apps: [
    {
      name: 'learn-express',
      script: 'src/index.ts',
      interpreter: 'node',
      interpreter_args: '--require ts-node/register',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3500
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3500
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3500
      },
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',

      // Advanced PM2 features
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,

      // Process management
      kill_timeout: 3000,
      listen_timeout: 3000,

      // Monitoring
      pmx: true,
      merge_logs: true,

      // Environment variables
      source_map_support: true,

      // Node.js specific
      node_args: '--max-old-space-size=1024'
    }
  ],

  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'ubuntu',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'git@github.com:your-username/learn-express.git',
      path: '/var/www/learn-express',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt update && apt install git -y'
    },
    staging: {
      user: 'ubuntu',
      host: ['your-staging-server-ip'],
      ref: 'origin/develop',
      repo: 'git@github.com:your-username/learn-express.git',
      path: '/var/www/learn-express-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging'
    }
  }
};
