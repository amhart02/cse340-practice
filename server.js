// Import express using ESM syntax
import express from 'express';

// Add these imports to your existing imports
import { fileURLToPath } from 'url';
import path from 'path';

// Import route handlers from their new locations
import indexRoutes from './src/routes/index.js';
import productRoutes from './src/routes/products/index.js';
import test from './src/routes/test.js';
import { setupDatabase, testConnection } from './src/models/setup.js';

// Add this import with your other route imports
import dashboardRoutes from './src/routes/dashboard/index.js';
 
// Import global middleware
import { addGlobalData } from './src/middleware/index.js';


// Create an instance of an Express application
const app = express();
const name = process.env.NAME;
const mode = process.env.NODE_ENV || 'development';
const NODE_ENV = process.env.NODE_ENV || 'production'
const PORT = process.env.PORT || 3000;

// Create __dirname and __filename variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
// Add this after your other middleware (static files, etc.)
app.use(addGlobalData);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory (where your templates are located)
app.set('views', path.join(__dirname, 'src/views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// added during test
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * Middleware
 */
app.use(addGlobalData);

/**
 * Routes
 */
app.use('/', indexRoutes);
app.use('/products', productRoutes);
app.use('/test', test);
app.use('/dashboard', dashboardRoutes);

app.get('/error', (req, res, next) => {
  // Throw an error
  console.log('💥 /error route hit');
  const err = new Error('This is a test server error');
  err.status = 500;
  next(err);  // Pass error to Express error handler
});

/**
 * Error Handling Middleware
 */

// 404 Error Handler
app.use((req, res, next) => {
    // Ignore error forwarding for expected missing assets
    const quiet404s = [
        '/favicon.ico',
        '/robots.txt'
    ];

    // Also skip any paths under /.well-known/
    const isQuiet404 = quiet404s.includes(req.path) || req.path.startsWith('/.well-known/');

    if (isQuiet404) {
        return res.status(404).send('Not Found');
    }

    // For all other routes, forward to the global error handler
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler middleware
app.use((err, req, res, next) => {
    // Log the error for debugging
    console.error(err.stack);
 
    // Set default status and determine error type
    const status = err.status || 500;
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Internal Server Error',
        error: err.message,
        stack: err.stack,
        NODE_ENV,
        PORT
    };
 
    // Render the appropriate template based on status code
    res.status(status).render(`errors/${status === 404 ? '404' : '500'}`, context);
});


// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');
 
    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });
 
        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });
 
        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

// Start the server and listen on the specified port
app.listen(PORT, async () => {
    try {
        await testConnection();
        await setupDatabase();
    } catch (error) {
        console.error('Database setup failed:', error);
        process.exit(1);
    }
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});