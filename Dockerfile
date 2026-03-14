FROM node:20-alpine

WORKDIR /app

# Install frontend dependencies and build
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN NODE_OPTIONS="--max-old-space-size=512" npm run build

# Move built frontend to final location
RUN mv dist frontend

# Clean up frontend source & node_modules (keep only backend + built frontend)
RUN rm -rf node_modules src components pages services scripts public \
    package.json package-lock.json vite.config.ts tsconfig.json \
    postcss.config.js index.html index.css index.tsx App.tsx \
    WebsiteLayout.tsx constants.tsx types.ts

# Install backend dependencies
RUN cd backend && npm install --omit=dev

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

CMD ["node", "backend/server.js"]