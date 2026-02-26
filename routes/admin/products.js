const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/product');

router.post('/product/add', (req, res) => {
    productController.addProduct(req, res);
});

router.get('/products', (req, res) => {
    productController.getAllProducts(req, res);
});

router.get('/product/:productId', (req, res) => {
    productController.getProductById(req, res);
});

router.put('/product/edit/:productId', (req, res) => {
    productController.updateProduct(req, res);
});

router.delete('/product/:productId', (req, res) => {
    productController.deleteProduct(req, res);
});

module.exports = router;
