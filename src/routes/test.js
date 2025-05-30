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

export default router;
