import { Router } from 'express';

const router = Router();

// Middleware to add a timestamp to res.locals for all views
router.use((req, res, next) => {
    // Create a formatted timestamp like "May 8, 2025 at 3:42 PM"
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
 
    // Adding to res.locals makes this available to all views automatically
    res.locals.timestamp = now.toLocaleDateString('en-US', options);
 
    next();
});

// Middleware to add global data to res.locals
export const addGlobalData = (req, res, next) => {
    // Get the current year for copyright notice
    res.locals.currentYear = new Date().getFullYear();
 
    // Add NODE_ENV for all views
    res.locals.NODE_ENV = process.env.NODE_ENV || 'development';
 
    next();
};

/**
 * Middleware Functions 
 */

router.use((req, res, next) => {
    res.locals.NODE_ENV = process.env.NODE_ENV || 'development';
    next();
});

// router.use((req, res, next) => {
//     console.log(`Method: ${req.method}, URL: ${req.url}`);
//     next(); // Pass control to the next middleware or route
// });


// Global middleware to set a custom header
router.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'Express Middleware Tutorial');
    next(); // Don't forget this or your request will hang!
});

// Global middleware to measure request processing time
// app.use((req, res, next) => {
//     // Record the time when the request started
//     const start = Date.now();
 
//     /**
//      * The `res` object has built-in event listeners we can use to trigger
//      * actions at different points in the request/response lifecycle.
//      * 
//      * We will use the 'finish' event to detect when the response has been
//      * sent to the client, and then calculate the time taken to process
//      * the entire request.
//      */
//     res.on('finish', () => {
//         // Calculate how much time has passed since the request started
//         const end = Date.now();
//         const processingTime = end - start;
 
//         // Log the results to the console
//         console.log(`${req.method} ${req.url} - Processing time: ${processingTime}ms`);
//     });
 
//     // Don't forget to call next() to continue to the next middleware
//     next();
// });



// Middleware to validate display parameter
const validateDisplayMode = (req, res, next) => {
    const { display } = req.params;
    if (display !== 'grid' && display !== 'details') {
        const error = new Error('Invalid display mode: must be either "grid" or "details".');
        next(error); // Pass control to the error-handling middleware
    }
    next(); // Pass control to the next middleware or route
};

export default router;