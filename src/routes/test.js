import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
    const title = 'Test';
    res.render('test', {title: title});
});

router.post('/', (req, res) => {
    const { name, email } = req.body;
    console.log(`Name: ${name}\nEmail: ${email}`);
    res.redirect('/test');
})

router.post('/login', (req, res) => {
    console.log('You are logged IN.')
    res.redirect('/test');
});

router.post('/logout', (req, res) => {
    console.log('You are logged OUT.')
    res.redirect('/test');
});

export default router;
