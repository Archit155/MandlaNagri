process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articleRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require('./middleware/errorHandler');

// Security packages
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const inviteRoutes = require('./routes/inviteRoutes');
const seedAdmin = require('./utils/seedAdmin');
const seedCategories = require('./utils/seedCategories');

// Ensure uploads directory exists for static serving
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Initialize database & seed data
connectDB().then(() => {
  seedAdmin().catch(err => console.error('Admin seed error:', err));
  seedCategories().catch(err => console.error('Category seed error:', err));
});

const app = express();

// Fix Express 5 query parser read-only issue
app.set('query parser', 'simple');
// Trust Render's proxy for express-rate-limit to work correctly
app.set('trust proxy', 1);

// Middlewares
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim().replace(/\/$/, '')) // Remove trailing underscores/slashes and whitespace
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  allowedOrigins.push('http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174');
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Normalize incoming origin for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    if (allowedOrigins.indexOf(normalizedOrigin) === -1) {
      console.warn(`🛑 CORS Blocked: Origin "${origin}" not in ALLOWED_ORIGINS`);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Passport
const passport = require('passport');
require('./config/passport');
app.use(passport.initialize());

// Set security HTTP headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000, // Increased dramatically for development
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);


// Routes
app.use('/api/articles', articleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/invites', inviteRoutes);

// Root response
app.get('/', (req, res) => {
  res.send('Local News API Backend is running. Please access the frontend application (usually on port 3000 or 5173).');
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Local News Status: UP' });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
