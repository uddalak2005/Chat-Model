const mongoose = require("mongoose");

let chatSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    created_at: {
        type: Date
    }
})

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat