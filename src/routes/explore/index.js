import { Router } from 'express';
import { getCategory, getItem, getRandomProduct } from '../../models/explore-data.js';
 
const router = Router();
 
/**
 * The explore functionality is more complex, involving data fetching and
 * dynamic content, so it gets its own directory. This keeps the code
 * organized and makes it easier to maintain and expand.
 */
 
// Route for /explore - redirects to a random product
router.get('/', async (req, res) => {
    const randomProduct = await getRandomProduct();
    res.redirect(`/explore/${randomProduct.category}/${randomProduct.id}`);
});
 
// Route with multiple parameters
router.get('/:category/:id', async (req, res) => {
    const { category, id } = req.params;
 
    // Use await to get data from the model
    const categoryData = await getCategory(category);
    const itemData = await getItem(category, id);
 
    // Check if data exists
    if (!categoryData || !itemData) {
        return res.status(404).render('errors/404', { 
            title: 'Item Not Found' 
        });
    }
 
    res.render('explore', { 
        title: `Exploring ${categoryData.name}`,
        category: categoryData,
        item: itemData,
        categoryId: category,
        itemId: id
    });
});
 
export default router;