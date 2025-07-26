import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();

// Rate limiting pour Vercel
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par windowMs
  message: {
    success: false,
    error: 'Trop de requêtes, veuillez réessayer plus tard.'
  }
});

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

app.use(compression());
app.use(morgan('combined'));
app.use(cookieParser());

// CORS configuration pour Vercel
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://pestalert-dashboard-mawl5k63z-ares-projects-0b0ee8dc.vercel.app',
    'https://pestalert-dashboard.vercel.app',
    /pestalert-dashboard.*\.vercel\.app$/,
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Routes d'authentification simplifiées pour Vercel
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Utilisateur admin par défaut pour le test
    if (email === 'admin@pestalert.com' && password === 'admin123') {
      const token = jwt.sign(
        {
          id: 'admin-1',
          email: 'admin@pestalert.com',
          role: 'admin'
        },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: 'admin-1',
          email: 'admin@pestalert.com',
          name: 'Admin PestAlert',
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Route de vérification du token
app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token manquant'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;

    res.json({
      success: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        name: 'Admin PestAlert',
        role: decoded.role
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token invalide'
    });
  }
});

// Routes dashboard simplifiées
app.get('/api/dashboard/metrics', (req, res) => {
  res.json({
    success: true,
    data: {
      totalFarmers: 156,
      totalAnalyses: 1247,
      successRate: 94.2,
      alertsCount: 23
    }
  });
});

app.get('/api/dashboard/users', (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: 156,
      activeUsers: 89,
      newUsers: 12
    }
  });
});

app.get('/api/dashboard/system/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      uptime: '99.9%',
      lastCheck: new Date().toISOString()
    }
  });
});

// Route par défaut
app.get('/', (req, res) => {
  res.json({
    message: 'PestAlert API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      dashboard: '/api/dashboard'
    }
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint non trouvé',
    path: req.originalUrl
  });
});

// Gestion des erreurs globales
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur'
  });
});

// Export pour Vercel
export default app;
