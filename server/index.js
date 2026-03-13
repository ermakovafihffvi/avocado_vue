import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import mkdirp from 'mkdirp';
import sqlite3 from 'sqlite3';
//import helmet from 'helmet';
import { resolve } from 'path';
//import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
//import todosRouter from './routes/todos.js';
import authRouter from './routes/auth.js';

import knex from 'knex';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';

const SQLiteStore = connectSqlite3(session);

const app = express();
const PORT = process.env.PORT || 3000;

global.knex = knex({
    client: 'mysql2',
    connection: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    },
});

mkdirp.sync('var/db');
global.sqlite = new sqlite3.Database('var/db/todos.db');

// Security middleware
//app.use(
//  helmet({
//    contentSecurityPolicy: false, // Disable CSP for development
//  })
//);

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
/*else {
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
}*/

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
app.use(passport.authenticate('session'));

// Error handling middleware
//app.use(notFoundHandler);
//app.use(errorHandler);

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


// API routes
//app.use('/api/todos', todosRouter);
app.use('/api', authRouter);

// Initialize database and start server
async function startServer() {
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
}

startServer();
