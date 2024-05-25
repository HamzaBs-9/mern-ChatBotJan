const mongoose = require("mongoose");

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
        throw new Error("Could not connect to MongoDB");
    }
}

async function disconnectFromDatabase() {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error(error);
        throw new Error("Could not disconnect from MongoDB");
    }
}

module.exports = { connectToDatabase, disconnectFromDatabase };
