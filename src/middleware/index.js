// src/middleware/index.js

export const addGlobalData = (req, res, next) => {
    // Current year for things like copyright
    res.locals.currentYear = new Date().getFullYear();

    // Timestamp formatted like "May 14, 2025 at 2:30 PM"
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    res.locals.timestamp = now.toLocaleDateString('en-US', options);

    // Set NODE_ENV in templates
    res.locals.NODE_ENV = process.env.NODE_ENV || 'development';

    // Custom header
    res.setHeader('X-Powered-By', 'Express Middleware Tutorial');

    // Log request processing time
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
    });

    next();
};
