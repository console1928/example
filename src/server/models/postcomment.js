const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostCommentSchema = new Schema(
    {
        author: { type: String, required: true },
        text: { type: String, required: true },
        comments: [{ type: Schema.Types.ObjectId, ref: "PostComment" }]
    }
);

module.exports = mongoose.model("PostComment", PostCommentSchema);
