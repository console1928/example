const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostCommentSchema = new Schema(
    {
        comment_sender: { type: String, required: true },
        comment_text: { type: String, required: true },
        child_comments: [{ type: Schema.Types.ObjectId, ref: "PostComment" }]
    }
);

module.exports = mongoose.model("PostComment", PostCommentSchema);
