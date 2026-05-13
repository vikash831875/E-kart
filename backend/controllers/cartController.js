import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

// ✅ GET CART
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id; // ✅ FIX

        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.json({
                success: true,
                cart: { items: [] }
            });
        }

        res.status(200).json({ success: true, cart });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ ADD TO CART
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id; // ✅ FIX
        const { productId } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Product not found"
            });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{
                    productId,
                    quantity: 1,
                    price: product.productPrice
                }],
                totalPrice: product.productPrice
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += 1;
            } else {
                cart.items.push({
                    productId,
                    quantity: 1,
                    price: product.productPrice
                });
            }

            cart.totalPrice = cart.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
        }

        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate("items.productId");

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart: populatedCart
        });

    } catch (error) {
        console.log("ADD TO CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ UPDATE QUANTITY
export const updateQuantity = async (req, res) => {
    try {
        const userId = req.user._id; // ✅ FIX
        const { productId, type } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(400).json({
                success: false,
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        if (type === "increase") item.quantity += 1;
        if (type === "decrease" && item.quantity > 1) item.quantity -= 1;

        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        await cart.save();
        cart = await cart.populate("items.productId");

        res.status(200).json({ success: true, cart });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ REMOVE FROM CART
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id; // ✅ FIX
        const { productId } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        await cart.save();
        cart = await cart.populate("items.productId");

        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        await Cart.findOneAndDelete({ userId });

        res.status(200).json({
            success: true,
            message: "Cart cleared",
            cart: { items: [], totalPrice: 0 }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};