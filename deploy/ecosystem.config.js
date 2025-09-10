module.exports = {
  apps: [
    {
      name: 'practic-crm-backend',
      script: 'artisan',
      args: 'serve --host=0.0.0.0 --port=8000',
      cwd: '/home/practic-crm/htdocs/crm.practic.studio/backend',
      interpreter: 'php',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        APP_ENV: 'production',
        APP_DEBUG: false,
        APP_URL: 'https://crm.practic.studio'
      },
      error_file: '/home/practic-crm/logs/practic-crm-backend-error.log',
      out_file: '/home/practic-crm/logs/practic-crm-backend-out.log',
      log_file: '/home/practic-crm/logs/practic-crm-backend.log',
      time: true
    },
    {
      name: 'practic-crm-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/practic-crm/htdocs/crm.practic.studio/frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'https://crm.practic.studio/api'
      },
      error_file: '/home/practic-crm/logs/practic-crm-frontend-error.log',
      out_file: '/home/practic-crm/logs/practic-crm-frontend-out.log',
      log_file: '/home/practic-crm/logs/practic-crm-frontend.log',
      time: true
    }
  ]
};
