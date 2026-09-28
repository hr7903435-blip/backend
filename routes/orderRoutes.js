const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const Food = require("../models/Food");
const Order = require("../models/Order");

// ======================================
// PLACE ORDER
// ======================================

router.post("/", async (req, res) => {
    try {
        const {
            items,
            address,
            paymentMethod
        } = req.body;

        // Validate cart

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        // Validate address

        if (
            typeof address !== "string" ||
            address.trim().length < 5 ||
            address.trim().length > 500
        ) {
            return res.status(400).json({
                message: "Please enter a valid address"
            });
        }

        // Validate payment method

        const allowedPayments = ["Cash", "UPI", "Card"];

        if (!allowedPayments.includes(paymentMethod)) {
            return res.status(400).json({
                message: "Invalid payment method"
            });
        }

        // Validate items and aggregate quantities

        const quantities = new Map();

        for (const item of items) {
            if (
                !item ||
                typeof item.foodId !== "string" ||
                !mongoose.isValidObjectId(item.foodId) ||
                !Number.isSafeInteger(item.quantity) ||
                item.quantity < 1 ||
                item.quantity > 99
            ) {
                return res.status(400).json({
                    message: "Invalid cart item"
                });
            }

            const id = item.foodId;

            const quantity =
                (quantities.get(id) || 0) + item.quantity;

            if (quantity > 99) {
                return res.status(400).json({
                    message: "Maximum quantity per item is 99"
                });
            }

            quantities.set(id, quantity);
        }

        // Get actual food prices from MongoDB

        const foodIds = [...quantities.keys()];

        const foods = await Food.find({
            _id: { $in: foodIds },
            available: true
        });

        if (foods.length !== foodIds.length) {
            return res.status(400).json({
                message: "Some food items are unavailable"
            });
        }

        // Calculate order total

        let totalAmount = 0;

        const orderItems = foods.map(food => {
            const quantity = quantities.get(
                food._id.toString()
            );

            totalAmount += food.price * quantity;

            return {
                food: food._id,
                name: food.name,
                price: food.price,
                quantity
            };
        });

        // Save order

        const order = await Order.create({
            items: orderItems,
            address: address.trim(),
            paymentMethod,
            totalAmount
        });

        // Send response

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to place order"
        });
    }
});

// ======================================
// GET ALL ORDERS
// ======================================

router.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 });

        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch orders"
        });
    }
});

// ======================================
// GET ORDER BY ID
// ======================================

router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json(order);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch order"
        });
    }
});

module.exports = router;