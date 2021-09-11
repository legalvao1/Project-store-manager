const router = require('express').Router();

const productController = require('../controllers/productsController');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.findProductById);
router.post('/', productController.addProduct); 
router.put('/:id', () => productController.updateProduct);
router.delete('/:id', () => {});

module.exports = router;