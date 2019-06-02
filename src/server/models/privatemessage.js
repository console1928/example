const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivateMessageSchema = new Schema(
    {
        message_sender: { type: String, required: true },
        message_text: { type: String, required: true }
    }
);

module.exports = mongoose.model("PrivateMessage", PrivateMessageSchema);
