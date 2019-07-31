const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        post_author: { type: String, required: true },
        post_name: { type: String, required: true },
        post_text: { type: String, required: true },
        post_comments: [{ type: Schema.Types.ObjectId, ref: "PostComment" }]
    }
);

module.exports = mongoose.model("Post", PostSchema);
