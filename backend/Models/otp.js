const mongoose = require("mongoose");
const otp = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    }

})

module.exports = mongoose.model("OTP", otp)