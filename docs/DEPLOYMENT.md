# Operational Deployment Guide

## 1. Environment Setup

### Backend (.env)
Ensure the following variables are set in production:
- `NODE_ENV`: production
- `MONGO_URI`: production connection string (Atlas)
- `JWT_SECRET`: strong random string
- `ADMIN_EMAIL`: support@onlinestore.com
- `EMAIL_PASS`: App password for sending emails
- `FRONTEND_URL`: https://www.onlinestore.com

### Frontend
Build the frontend for production:
```bash
npm run build
```
This generates the `dist/` folder which should be served by Nginx or S3/CloudFront.

## 2. Safety & Security
- **Rate Limiting**: Configured in `server.js` (100 req/15min).
- **Helmet**: Enabled for header security.
- **CORS**: Locked to `FRONTEND_URL`.

## 3. Backups
Automated backup script is located at `backend/scripts/backup.js`.
Schedule this via cron:
```cron
0 2 * * * node /path/to/backend/scripts/backup.js >> /var/log/backup.log 2>&1
```

## 4. Monitoring
- **Logs**: Located in `backend/error.log` and `backend/combined.log`.
- **Analytics**: Google Analytics 4 is integrated on the frontend.
- **Support**: Admin dashboard has a "Support" tab to manage incoming tickets.

## 5. Updates
1. Pull latest code.
2. `npm install` in both folders.
3. `npm run build` in frontend.
4. Restart backend management process (PM2 recommended):
```bash
pm2 restart online-store-backend
```
