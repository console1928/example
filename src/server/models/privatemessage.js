const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivateMessageSchema = new Schema(
    {
        sender: { type: String, required: true },
        text: { type: String, required: true }
    }
);

module.exports = mongoose.model("PrivateMessage", PrivateMessageSchema);
