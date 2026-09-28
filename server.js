require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const app = express();

// ======================================
// MIDDLEWARE
// ======================================

app.use(cors());

app.use(express.json());

// ======================================
// ROUTES
// ======================================

const foodRoutes = require("./routes/foodRoutes");

const orderRoutes = require("./routes/orderRoutes");

app.use("/api/foods", foodRoutes);

app.use("/api/orders", orderRoutes);

// ======================================
// HOME ROUTE
// ======================================

app.get("/", (req, res) => {
    res.send("Foodie API is running!");
});

// ======================================
// DATABASE CONNECTION
// ======================================

const PORT = process.env.PORT || 5001;

async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected Successfully!");

        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error("Server error:", error.message);

        process.exit(1);
    }
}

startServer();