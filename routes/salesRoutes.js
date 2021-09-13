const router = require('express').Router();

const salesController = require('../controllers/salesController');

router.get('/', salesController.getAllSales);
router.get('/:id', () => {});
router.post('/', salesController.addSale);
router.put('/:id', () => {});
router.delete('/:id', () => {});

module.exports = router;