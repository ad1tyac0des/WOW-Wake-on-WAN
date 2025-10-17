const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    lastPowerSignal: {
        type: Date,
        default: null,
    }
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel;