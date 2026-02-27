const Product = require('../models/product');

class shopController {

    async getAllProducts(req, res) {
        const products = await Product.findAll();
        console.log(products);
        res.status(201).json({
            products: products
        });
    }

    async getCart(req, res) {
        const userCart = await req.user.getCart();
        console.log(userCart);
        const cartProducts = await userCart.getProducts();
        res.status(201).json({
            products: cartProducts
        });
    }

    async addProductToCart(req, res) {
        const productId = req.body.productId || req.params.productId;

        if (!productId) {
            return res.status(400).json({
                message: 'productId is required'
            });
        }

        try {
            const cart = await req.user.getCart();
            const existingProducts = await cart.getProducts({ where: { id: productId } });
            let product = existingProducts[0];
            let newQuantity = 1;

            if (product) {
                newQuantity = product.cartitem.quantity + 1;
            } else {
                product = await Product.findByPk(productId);
                if (!product) {
                    return res.status(404).json({
                        message: 'Product not found'
                    });
                }
            }

            await cart.addProduct(product, { through: { quantity: newQuantity } });

            return res.status(200).json({
                message: 'Product added to cart'
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Failed to add product to cart',
                error: error.message
            });
        }
    }

    async removeProductFromCart(req, res) {
        const productId = req.body.productId || req.params.productId;

        if (!productId) {
            return res.status(400).json({
                message: 'productId is required'
            });
        }

        try {
            const cart = await req.user.getCart();
            const products = await cart.getProducts({ where: { id: productId } });
            const product = products[0];

            if (!product) {
                return res.status(404).json({
                    message: 'Product is not in cart'
                });
            }

            await product.cartitem.destroy();

            return res.status(200).json({
                message: 'Product removed from cart'
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Failed to remove product from cart',
                error: error.message
            });
        }
    }

    async postOrder(req, res) {
        try {
            const cart = await req.user.getCart();
            const products = await cart.getProducts();

            if (!products.length) {
                return res.status(400).json({
                    message: 'Cart is empty'
                });
            }

            const order = await req.user.createOrder();
            await order.addProducts(
                products.map(product => {
                    product.orderitem = { quantity: product.cartitem.quantity };
                    return product;
                })
            );

            await cart.setProducts([]);

            return res.status(201).json({
                message: 'Order created successfully',
                orderId: order.id
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Failed to create order',
                error: error.message
            });
        }
    }

    async getOrders(req, res) {
        try {
            const orders = await req.user.getOrders();
            const ordersWithProducts = await Promise.all(
                orders.map(async order => {
                    const products = await order.getProducts();
                    return {
                        id: order.id,
                        products: products
                    };
                })
            );

            return res.status(200).json({
                orders: ordersWithProducts
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Failed to fetch orders',
                error: error.message
            });
        }
    }
}

module.exports = new shopController();
