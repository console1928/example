const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: { type: String, required: true, max: 100 },
        firstName: { type: String, required: true, max: 100 },
        lastName: { type: String, required: true, max: 100 },
        picture: { type: String },
        salt: { type: String, required: true },
        hash: { type: Buffer, required: true },
        cookie: { type: String },
        contacts: [{ type: String }],
        dialogues: [{ type: String }],
        posts: [{ type: String }]
    }
);

module.exports = mongoose.model("User", UserSchema);
