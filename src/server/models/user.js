const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        user_name: { type: String, required: true, max: 100 },
        first_name: { type: String, required: true, max: 100 },
        last_name: { type: String, required: true, max: 100 },
        user_picture: { type: String },
        salt: { type: String, required: true },
        hash: { type: Buffer, required: true },
        cookie: { type: String },
        dialogues: [{ type: Schema.Types.ObjectId, ref: "Dialogue" }],
        posts: [{ type: Schema.Types.ObjectId, ref: "Post" }]
    }
);

module.exports = mongoose.model("User", UserSchema);
