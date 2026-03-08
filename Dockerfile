# ============ Backend Dependencies ============
FROM node:20-alpine AS backend-build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/ .

# ============ Production ============
FROM node:20-alpine

WORKDIR /app

# Install nginx
RUN apk add --no-cache nginx

# Copy backend (with node_modules from build stage)
COPY --from=backend-build /app/backend /app/backend

# Copy pre-built frontend (built locally with npm run build)
COPY dist/ /app/frontend

# Copy nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Create startup script
RUN printf '#!/bin/sh\nnginx\ncd /app/backend && node server.js\n' > /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 80 5000

CMD ["/app/start.sh"]