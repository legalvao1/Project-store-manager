const router = require('express').Router();

const productController = require('../controllers/productsController');

router.get('/', () => {});
router.get('/:id', () => {});
router.post('/', productController.addProduct);
router.put('/:id', () => {});
router.delete('/:id', () => {});

module.exports = router;