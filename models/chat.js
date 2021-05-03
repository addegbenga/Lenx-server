const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    receiverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    message: {
        type: String,
        required: true
    }
}, 
{
    timestamps: true
});

module.exports =  mongoose.model("Chat", chatSchema);