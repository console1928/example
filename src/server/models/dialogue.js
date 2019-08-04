const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DialogueSchema = new Schema(
    {
        name: { type: String, required: true },
        picture: { type: String },
        messages: [{ type: Schema.Types.ObjectId, ref: "PrivateMessage" }]
    }
);

module.exports = mongoose.model("Dialogue", DialogueSchema);
