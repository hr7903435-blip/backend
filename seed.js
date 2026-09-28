require("dotenv").config();

const mongoose = require("mongoose");

const Food = require("./models/Food");

const foods = [
    {
        name: "Margherita Pizza",
        description: "Fresh tomato, mozzarella and basil",
        category: "pizza",
        price: 199,
        image: "/images/pizza.png",
        rating: 4.8
    },

    {
        name: "Cheese Burger",
        description: "Juicy burger with cheese and vegetables",
        category: "burger",
        price: 149,
        image: "/images/burger.jpg",
        rating: 4.7
    },

    {
        name: "Chicken Biryani",
        description: "Aromatic basmati rice with spicy chicken",
        category: "biryani",
        price: 249,
        image: "/images/biryani.jpg",
        rating: 4.9
    },

    {
        name: "Hakka Noodles",
        description: "Stir fried noodles with fresh vegetables",
        category: "chinese",
        price: 179,
        image: "/images/noodles.jpg",
        rating: 4.6
    },

    {
        name: "Chocolate Cake",
        description: "Soft chocolate cake with creamy frosting",
        category: "dessert",
        price: 129,
        image: "/images/cake.jpg",
        rating: 4.8
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Food.deleteMany({});

        await Food.insertMany(foods);

        console.log("Food items added successfully!");

    } catch (error) {
        console.error(error);

    } finally {
        await mongoose.disconnect();
    }
}

seedDatabase();