const Product = require('../models/product');

class productController {

    async getAllProducts(req, res) {
        try {
            const products = await Product.findAll();
            res.status(200).json({
                products: products
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to fetch products',
                error: error.message
            });
        }
    }

    async getProductById(req, res) {
        const productId = req.params.productId;

        try {
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            return res.status(200).json({
                product: product
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Failed to fetch product',
                error: error.message
            });
        }
    }
}

module.exports = new productController(); 
