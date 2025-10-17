const mongoose = require('mongoose')

function connectDB() {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to DB!")
    })
    .catch((error) => {
        console.log("Error Connecting to DB " + error)
    })
}

module.exports = connectDB;