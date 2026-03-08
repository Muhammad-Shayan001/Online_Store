FROM node:20-alpine

WORKDIR /app

# Copy and install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend source
COPY backend/ ./backend/

# Copy pre-built frontend (run "npm run build" locally first)
COPY dist/ ./frontend/

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "backend/server.js"]