const Product = require('../../models/product');

class adminController {

    async addProduct(req, res) {
        try {
            const product = await Product.create({
                title: req.body.title,
                price: req.body.price,
                imageurl: req.body.imageurl,
                description: req.body.description,
                userId: req.user.id
            });

            res.status(201).json({
                message: 'Product created successfully',
                productId: product.id
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to create product',
                error: error.message
            });
        }
    }

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

    async updateProduct(req, res) {
        const productId = req.params.productId;
        const isEditAllowed = req.query.edit === 'true';

        if (!isEditAllowed) {
            return res.status(403).json({
                message: 'Editing is not allowed without edit=true'
            });
        }

        try {
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            if (req.body.title !== undefined) {
                product.title = req.body.title;
            }
            if (req.body.price !== undefined) {
                product.price = req.body.price;
            }
            if (req.body.imageurl !== undefined) {
                product.imageurl = req.body.imageurl;
            }
            if (req.body.description !== undefined) {
                product.description = req.body.description;
            }

            await product.save();

            return res.status(200).json({
                message: 'Product updated successfully',
                product: product
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Failed to update product',
                error: error.message
            });
        }
    }

    async deleteProduct(req, res) {
        const productId = req.params.productId;

        try {
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            await product.destroy();
            return res.status(200).json({
                message: 'Product deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Failed to delete product',
                error: error.message
            });
        }
    }
}

module.exports = new adminController();
