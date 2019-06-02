const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DialogueSchema = new Schema(
    {
        dialogue_name: { type: String, required: true },
        dialogue_picture: { type: String, required: true },
        messages: [{ type: Schema.Types.ObjectId, ref: "PrivateMessage" }]
    }
);

module.exports = mongoose.model("Dialogue", DialogueSchema);
