// Import express using ESM syntax
import express from 'express';

// Add these imports to your existing imports
import { fileURLToPath } from 'url';
import path from 'path';

// Create an instance of an Express application
const app = express();
const name = process.env.NAME;

// Create __dirname and __filename variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the port number the server will listen on
const NODE_ENV = process.env.NODE_ENV || 'production'
const PORT = process.env.PORT || 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the views directory (where your templates are located)
app.set('views', path.join(__dirname, 'src/views'));

// Define a route handler for the root URL ('/')
app.get('/', (req, res) => {
    const title = 'Home Page';
    const content = '<h1>Welcome to the Home Page</h1><p>This is the main content of the home page.</p>';
    res.render('index', { title, content })
});

app.get('/about', (req, res) => {
    const title = 'About Page';
    const url = '/img/hamstermeme.webp'
    res.render('about', { title, imageUrl : url })
});

app.get('/contact', (req, res) => {
    const title = 'Contact Page';
    res.render('contact', { title })
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
