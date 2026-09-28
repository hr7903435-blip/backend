const express = require("express");

const router = express.Router();

const Food = require("../models/Food");

// GET ALL FOOD ITEMS

router.get("/", async (req, res) => {
    try {
        const foods = await Food.find({
            available: true
        });

        res.status(200).json(foods);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch food items"
        });
    }
});

// GET FOOD BY ID

router.get("/:id", async (req, res) => {
    try {
        const food = await Food.findOne({
            _id: req.params.id,
            available: true
        });

        if (!food) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        res.status(200).json(food);

    } catch (error) {
        res.status(400).json({
            message: "Invalid food ID"
        });
    }
});

module.exports = router;