import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import helmet from 'helmet';
import { resolve } from 'path';
import session from 'express-session';
import { sequelize, sessionStore } from '#server/bd.js';
import cron from 'node-cron';
import { setScheduledExpenses } from '#server/cron-tasks/setScheduledExpenses.js';
import { errorHandler } from '#server/middleware/errorHandler.js';
import initRoutes from '#server/routes/index.js';
import constants from "#shared/contants.js";
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 3000;

//Trust Nginx server proxy
app.set('trust proxy', 1);

// Security middleware
app.use(
    helmet({
        contentSecurityPolicy: false, // Disable CSP for development
    })
);

// CORS configuration
app.use(
    cors({
        origin:
            process.env.NODE_ENV === 'production'
            ? process.env.ALLOWED_ORIGINS?.split(',') || []
            : ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true,
    })
);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
    });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const staticPath = resolve(process.cwd(), 'dist');
    app.use(express.static(staticPath));

    // Catch-all route for SPA
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api/')) {
            res.sendFile(resolve(staticPath, 'index.html'));
        } else {
            next();
        }
    });
} 
//redirect not api
/*
    const staticPath = resolve(process.cwd(), 'dist');
    app.use(express.static(staticPath));
    // Catch-all route for SPA
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api/')) {
            res.sendFile(resolve(staticPath, 'index.html'));
        } else {
            next();
        }
    });
*/

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));
app.use(passport.authenticate('session'));

app.use((req, res, next) => {
    if (!req.user 
        && !req.path.startsWith('/api/login') 
        && !req.path.startsWith('/api/signup') 
        && !req.path.startsWith('/api/logout')
        && !req.path.startsWith('/api/user-exists')
    ) {
        res.status(401).json({ message: 'Unauthorized' });
    } else {
        next();
    }
});

// Graceful shutdown handler
/*const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);

  try {
    await db.teardown();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};*/

// Register graceful shutdown handlers
//process.on('SIGINT', () => gracefulShutdown('SIGINT'));
//process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
//process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // Sent by nodemon

initRoutes(app);

// Error handling middleware
//app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    sessionStore.clear(() => {
        console.log('sessions cleared');
    });

    try {
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

            if (process.env.NODE_ENV !== 'production') {
                console.log(`API available at: http://localhost:${PORT}/api`);
                console.log(`Health check: http://localhost:${PORT}/health`);
            }
        });

        // Handle server errors
        server.on('error', (error) => {
            console.error('Server error:', error);
            process.exit(1);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }

    //run cron tasks
    if (process.env.NODE_ENV === 'production') {
        //GMT + 0 11:00
        const minutes = process.env.NODE_ENV === 'production' ? '0' : (new Date()).getMinutes() + 1;
        const hours = process.env.NODE_ENV === 'production' ? '11' : (new Date()).getHours();
        cron.schedule('0 ' + minutes + ' ' + hours + ' ' + (constants.XDATE - 21) + ' * *', () => {
            setScheduledExpenses();
        });
    }

    /*
    const passwd = '123456';
    const hash = await bcrypt.hash(passwd, 12);

    const new_hash = await bcrypt.hash(passwd, 12);
    const hash_s = await bcrypt.hash(new_hash, 12);
    const match1 = await bcrypt.compare(hash, hash_s);
    console.log(match1);

    const hash_s1 = await bcrypt.hash(hash, 12);
    const match2 = await bcrypt.compare(hash, hash_s1);
    console.log(match2);
    */
}

startServer();
