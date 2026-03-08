const express = require('express');
const dotenv = require('dotenv');

// Load env vars immediately
dotenv.config();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit'); // Security Hardening
const path = require('path');
const connectDB = require('./config/db');
const logger = require('./utils/logger'); // Centralized Logs
const cookieParser = require('cookie-parser');

const app = express();

// Trust the Railway proxy so rate limiter doesn't block the load balancer
app.set('trust proxy', 1);

// Health check endpoint MUST be before rate limiter so Railway pings don't get blocked
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Rate Limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

app.use(express.json());
app.use(cookieParser());

// Robust CORS for Vercel and Railway
app.use(cors({
  origin: function (origin, callback) {
    // Allow Vercel, localhost, or requests with no origin (like mobile apps/postman)
    if (!origin || origin.includes('vercel.app') || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Configure helmet for production (allow inline scripts for React)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// Custom skip function for Morgan to ignore 401 on profile check (avoids log noise)
// Also skipping successful requests (status < 400) to keep terminal clean
const skipLog = (req, res) => {
    const isProfile401 = req.url.includes('/api/users/profile') && res.statusCode === 401;
    const isSuccess = res.statusCode < 400;
    return isProfile401 || isSuccess;
};

app.use(morgan('combined', { 
    stream: { write: message => logger.info(message.trim()) },
    skip: skipLog
})); // Log requests to winston

// Import Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const couponRoutes = require('./routes/couponRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/coupons', couponRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// Start HTTP server immediately (so Railway healthcheck passes)
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Connect to MongoDB in the background
connectDB().then(() => {
    console.log('Database connected successfully');
}).catch(err => {
    console.error("Failed to connect to Database", err);
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is busy, retrying in 1 second...`);
        setTimeout(() => {
            server.close();
            server.listen(PORT);
        }, 1000);
    } else {
         console.error(e);
    }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received. Closing server.');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.info('SIGINT signal received. Closing server.');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

// Handle Nodemon restart signal explicitly
process.once('SIGUSR2', () => {
    console.info('SIGUSR2 received (Nodemon restart). Closing server.');
    server.close(() => {
        process.kill(process.pid, 'SIGUSR2');
    });
});
