const mongoose = require('mongoose');

const MONGO_URL = "mongodb://127.0.0.1:27017/playlister";

mongoose
    .connect(MONGO_URL, {
        useNewUrlParser: true,
    })
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
    });

const db = mongoose.connection;

db.once("open", () => {
    console.log("Connected to MongoDB");
});

module.exports = db;



