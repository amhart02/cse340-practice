import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Define important variables
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;
 
/**
 * Create an instance of an Express application
 */
const app = express();
 
/**
 * Configure the Express server
 */
 
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
 
// Set the view engine to EJS
app.set('view engine', 'ejs');
 
// Set the views directory (where your templates are located)
app.set('views', path.join(__dirname, 'src/views'));
 
/**
 * Middleware
 */
// Middleware to add global data to res.locals
app.use((req, res, next) => {
    // Get the current year for copyright notice
    res.locals.currentYear = new Date().getFullYear();
 
    // Add NODE_ENV for all views
    res.locals.NODE_ENV = process.env.NODE_ENV || 'development';
 
    next();
});

// Middleware to validate display parameter
const validateDisplayMode = (req, res, next) => {
    const { display } = req.params;
    if (display !== 'grid' && display !== 'details') {
        return res.status(400).send('Invalid display mode: must be either "grid" or "details".');
    }
    next(); // Pass control to the next middleware or route
};
 
/**
 * Routes
 */
app.get('/', (req, res) => {
    const title = "Home";
    res.render('index', { title });
});

app.get('/about', (req, res) => {
    const title = "About";
    res.render('about', { title });
});

// Products page route with display mode validation
app.get('/products/:display', validateDisplayMode, (req, res) => {
    const title = "Our Products";
    const { display } = req.params;
 
    // Sample product data
    const products = [
        {
            id: 1,
            name: "Kindle E-Reader",
            description: "Lightweight e-reader with a glare-free display and weeks of battery life.",
            price: 149.99,
            image: "https://picsum.photos/id/367/800/600"
        },
        {
            id: 2,
            name: "Vintage Film Camera",
            description: "Capture timeless moments with this classic vintage film camera, perfect for photography enthusiasts.",
            price: 199.99,
            image: "https://picsum.photos/id/250/800/600"
        }
    ];
 
    res.render('products', { title, products, display });
});
 
// Default products route (redirects to grid view)
app.get('/products', (req, res) => {
    res.redirect('/products/grid');
});

// Updated route to handle both route and query parameters
app.get('/explore/:category/:id', (req, res) => {
    // Get route parameters
    const { category, id } = req.params;
 
    // Get query parameters (optional)
    const { sort = 'default', filter = 'none' } = req.query;
 
    // Log all parameters for debugging
    console.log('Route Parameters:', req.params);
    console.log('Query Parameters:', req.query);
 
    // Set the title for the page
    const title = `Exploring ${category}`;
 
    // Render the template with all parameters
    res.render('explore', { title, category, id, sort, filter });
});
 
// 404 Error Handler
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err); // Forward to the global error handler
});
 
// Global Error Handler
app.use((err, req, res, next) => {
    // Log the error for debugging
    console.error(err.stack);
 
    // Set default status and determine error type
    const status = err.status || 500;
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Internal Server Error',
        error: err.message,
        stack: err.stack
    };
 
    // Render the appropriate template based on status code
    res.status(status).render(`errors/${status === 404 ? '404' : '500'}`, context);
});
 
/**
 * Start the server
 */
 
// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');
 
    try {
        const wsPort = parseInt(PORT);
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
 
// Start the Express server on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});