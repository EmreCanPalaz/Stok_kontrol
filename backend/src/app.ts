import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import connectDB from './config/database';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import stockRoutes from './routes/stock';
import userRoutes from './routes/users';
import inventoryRoutes from './routes/inventory';
import feedbackRoutes from './routes/feedback';
import reviewsRoutes from './routes/reviews';

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// Daha güvenilir CORS yapılandırması
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // `origin` undefined ise (örneğin Postman gibi araçlardan gelen istekler) veya beyaz listede ise izin ver
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bu adresten gelen isteklere CORS politikası tarafından izin verilmiyor.'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/reviews', reviewsRoutes);

// Doğrudan tanımlanan reviews rotası
app.post('/api/reviews-direct', (req, res) => {
  console.log('Doğrudan tanımlanan reviews rotası çağrıldı:', req.body);
  res.status(201).json({
    success: true,
    message: 'Doğrudan tanımlanan reviews rotası başarıyla çalıştı',
    receivedData: req.body
  });
});

// Debug endpoint for reviews API
app.get('/api/reviews-test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Reviews API test endpoint is working!' 
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use('/*', (req, res) => {
  console.log(`404 hatası: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: 'Route not found', 
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;