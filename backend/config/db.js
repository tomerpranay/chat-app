const mongoose = require('mongoose')
require('dotenv').config()
exports.connectDB = () => {
    mongoose.connect(process.env.MongoURL)
        .then(() => console.log("DB connected"))
        .catch((error) => {
            console.log(error + " while coonection DB")
            process.exit(1)
        })


}