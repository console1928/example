const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        author: { type: String, required: true },
        name: { type: String, required: true },
        text: { type: String, required: true },
        previewPicture: { type: String, required: false },
        date: { type: Date },
        comments: [{ type: Schema.Types.ObjectId, ref: "PostComment" }],
        likes: [{ type: String }]
    }
);

module.exports = mongoose.model("Post", PostSchema);
