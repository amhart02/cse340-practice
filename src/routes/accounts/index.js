import express from 'express';
const router = express.Router();
 
/**
 * Display the login form
 */
router.get('/login', (req, res) => {
    // Check if user is already logged in
    if (req.session.isLoggedIn) {
        return res.redirect('/accounts/dashboard');
    }
 
    res.render('accounts/login', {
        title: 'Login'
    });
});
 
/**
 * Process login form submission
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;
 
    // Basic validation
    if (!username || !password) {
        req.flash('error', 'Username and password are required');
        return res.render('accounts/login', {
            title: 'Login'
        });
    }
 
    // For this assignment, any valid form submission logs the user in
    req.session.isLoggedIn = true;
    req.session.username = username;
    req.session.loginTime = new Date();
 
    // Flash success message and redirect
    req.flash('success', `Welcome back, ${username}! You have successfully logged in.`);
    res.redirect('/accounts/dashboard');
});
 
/**
 * Display the user dashboard (protected route)
 */
router.get('/dashboard', (req, res) => {
    // Check if user is logged in
    if (!req.session.isLoggedIn) {
        req.flash('error', 'Please log in to access the dashboard');
        return res.redirect('/accounts/login');
    }
 
    res.render('accounts/dashboard', {
        title: 'Account Dashboard',
        username: req.session.username,
        loginTime: req.session.loginTime
    });
});
 
/**
 * Process logout request
 */
router.post('/logout', (req, res) => {
    const username = req.session.username;
 
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            req.flash('error', 'Logout failed. Please try again.');
            return res.redirect('/accounts/dashboard');
        }
 
        // Clear the session cookie
        res.clearCookie('sessionId');
 
        // Flash success message and redirect to home
        req.flash('success', `Goodbye, ${username}! You have been successfully logged out.`);
        res.redirect('/');
    });
});
 
export default router;