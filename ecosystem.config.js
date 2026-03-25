module.exports = {
  apps: [
    {
      name: 'uns-nextjs',
      cwd: '/home/ubuntu/UNS_WEBZINE_BACKUP',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
        STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        JWT_SECRET: process.env.JWT_SECRET
      },
      error_file: '/home/ubuntu/.pm2/logs/uns-nextjs-error.log',
      out_file: '/home/ubuntu/.pm2/logs/uns-nextjs-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'uns-strapi',
      cwd: '/home/ubuntu/UNS_WEBZINE_BACKUP/strapi-cms',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 1337
      },
      error_file: '/home/ubuntu/.pm2/logs/uns-strapi-error.log',
      out_file: '/home/ubuntu/.pm2/logs/uns-strapi-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
