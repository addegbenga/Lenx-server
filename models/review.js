const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    description: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});


module.exports = mongoose.model("Review", reviewSchema);