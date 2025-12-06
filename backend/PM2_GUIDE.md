# PM2 Deployment and Usage Guide

This guide covers how to use PM2 to manage your Express.js application in production and development environments.

## What is PM2?

PM2 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, reload them without downtime, and facilitate common system admin tasks.

## Installation

PM2 is already installed as a dev dependency in this project. To install it globally (recommended for production servers):

```bash
npm install pm2 -g
```

## Quick Start

### Start the Application
```bash
npm run pm2:start
```

### Check Application Status
```bash
npm run pm2:status
```

### View Logs
```bash
npm run pm2:logs
```

### Stop the Application
```bash
npm run pm2:stop
```

## PM2 Configuration

The application uses `ecosystem.config.js` for PM2 configuration. Here are the key settings:

### Basic Configuration
- **Name**: `learn-express`
- **Script**: `src/index.ts` (runs with ts-node)
- **Instances**: 1 (can be increased for load balancing)
- **Port**: 3500
- **Max Memory**: 1GB (restarts if exceeded)

### Environments
- **Development**: `NODE_ENV=development`
- **Production**: `NODE_ENV=production`
- **Staging**: `NODE_ENV=staging`

## Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm run pm2:start` | Start the application |
| `npm run pm2:stop` | Stop the application |
| `npm run pm2:restart` | Restart the application |
| `npm run pm2:reload` | Reload with zero downtime |
| `npm run pm2:delete` | Delete the application from PM2 |
| `npm run pm2:logs` | View application logs |
| `npm run pm2:monit` | Open PM2 monitoring dashboard |
| `npm run pm2:status` | Check application status |
| `npm run pm2:start:prod` | Start in production mode |
| `npm run pm2:start:staging` | Start in staging mode |

## Production Deployment

### 1. Environment Setup
```bash
# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install pm2 -g

# Setup PM2 startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

### 2. Application Deployment
```bash
# Clone your repository
git clone <your-repo-url>
cd learn-express

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your production values

# Start with PM2
npm run pm2:start:prod

# Save PM2 configuration
pm2 save
```

### 3. Zero-Downtime Deployment Script
Create a deployment script `deploy.sh`:

```bash
#!/bin/bash
echo "Starting deployment..."

# Pull latest code
git pull origin main

# Install/update dependencies
npm install

# Build if you have a build step
# npm run build

# Reload application with zero downtime
npm run pm2:reload

echo "Deployment completed!"
```

## Monitoring and Logs

### View Real-time Logs
```bash
pm2 logs learn-express --lines 50
```

### Monitor Resource Usage
```bash
pm2 monit
```

### Check Application Health
```bash
pm2 status
```

### Log Management
Logs are stored in:
- Combined logs: `./logs/combined.log`
- Output logs: `./logs/out.log`
- Error logs: `./logs/error.log`

### Log Rotation (Recommended for Production)
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

## Load Balancing

To run multiple instances for load balancing:

1. Update `ecosystem.config.js`:
```javascript
instances: 'max', // or specify a number like 4
exec_mode: 'cluster'
```

2. Restart the application:
```bash
npm run pm2:restart
```

## Environment Variables

### Development
```bash
NODE_ENV=development
PORT=3500
```

### Production
```bash
NODE_ENV=production
PORT=3500
# Add your production database URLs, API keys, etc.
```

## Common PM2 Commands

### Process Management
```bash
pm2 start ecosystem.config.js          # Start application
pm2 stop learn-express                 # Stop by name
pm2 restart learn-express              # Restart
pm2 reload learn-express               # Zero-downtime reload
pm2 delete learn-express               # Remove from PM2
```

### Information
```bash
pm2 list                               # List all processes
pm2 describe learn-express             # Detailed info about app
pm2 show learn-express                 # Show app details
```

### Logs
```bash
pm2 logs                              # All logs
pm2 logs learn-express                # App-specific logs
pm2 flush                             # Clear all logs
```

### Monitoring
```bash
pm2 monit                             # Process monitoring
pm2 plus                              # PM2+ web monitoring (optional)
```

## Troubleshooting

### Application Won't Start
1. Check if the port is already in use:
   ```bash
   lsof -i :3500
   ```

2. Check PM2 logs for errors:
   ```bash
   pm2 logs learn-express --err
   ```

3. Verify environment variables:
   ```bash
   pm2 describe learn-express
   ```

### High Memory Usage
1. Monitor memory usage:
   ```bash
   pm2 monit
   ```

2. Adjust memory limit in `ecosystem.config.js`:
   ```javascript
   max_memory_restart: '2G'
   ```

### Database Connection Issues
1. Check if database is accessible
2. Verify DATABASE_URL in environment
3. Check network connectivity

### Permission Issues
```bash
# Fix npm permissions
sudo chown -R $USER:$(id -gn $USER) ~/.npm
sudo chown -R $USER:$(id -gn $USER) /usr/lib/node_modules
```

## Best Practices

### 1. Use Environment-Specific Configurations
```bash
pm2 start ecosystem.config.js --env production
```

### 2. Set Up Health Checks
Add health check endpoint in your Express app:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

### 3. Monitor Resource Usage
- Set memory limits
- Monitor CPU usage
- Set up alerts for crashes

### 4. Backup Strategy
- Regular database backups
- Code repository backups
- PM2 configuration backups

### 5. Security
- Run PM2 as non-root user
- Use environment variables for secrets
- Regular security updates

## Integration with Nginx (Optional)

If using Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3500;
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

## Auto-Deployment with Git Hooks

Set up automatic deployment on git push:

1. Create post-receive hook in your git repository
2. Use PM2 deploy feature:
   ```bash
   pm2 deploy production setup
   pm2 deploy production
   ```

## Support

For PM2-specific issues:
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [PM2 GitHub](https://github.com/Unitech/pm2)

For application-specific issues, check the application logs and ensure all dependencies are properly installed.