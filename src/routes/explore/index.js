import { Router } from 'express';
import { getAllCategories, getCategory, getCategoryItems, getRandomProduct } from '../../models/explore-data.js';
 
const router = Router();
 
/**
 * The explore functionality is more complex, involving data fetching and
 * dynamic content, so it gets its own directory. This keeps the code
 * organized and makes it easier to maintain and expand.
 */
 
// Route for /explore - redirects to a random category
router.get('/', async (req, res) => {
    const randomProduct = await getRandomProduct();
    res.redirect(`/explore/${randomProduct.category}`);
});
 
// Route for viewing a category and its items
router.get('/:category', async (req, res) => {
    const { category } = req.params;
 
    // Use model to get category data
    const categoryData = await getCategory(category);
 
    // Check if category exists
    if (!categoryData) {
        /**
         * If the category or item doesn't exist, create a 404 error
         * and pass it to the error handler by throwing it. This is
         * possible in Express 5+ because it automatically catches async
         * errors and passes them to your registered error handler.
         */
        const err = new Error('Category Not Found');
        err.status = 404;
        throw err;
    }
 
    // Get the items in this category
    const items = await getCategoryItems(category);
 
    // Render the explore template with category and items
    res.render('explore', { 
        title: `Exploring ${categoryData.name}`,
        categoryId: category,
        categoryName: categoryData.name,
        categoryDescription: categoryData.description,
        items: items
    });
});
 
// Redirect item routes to category page
router.get('/:category/:id', async (req, res) => {
    const { category } = req.params;
    res.redirect(`/explore/${category}`);
});
 
export default router;