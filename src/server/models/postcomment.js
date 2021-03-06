const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostCommentSchema = new Schema(
    {
        author: { type: String, required: true },
        text: { type: String, required: true },
        date: { type: Date },
        comments: [{ type: Schema.Types.ObjectId, ref: "PostComment" }],
        likes: [{ type: String }]
    }
);

module.exports = mongoose.model("PostComment", PostCommentSchema);
