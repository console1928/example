const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema(
    {
        author: { type: String, required: true },
        text: { type: String, required: true },
        date: { type: Date }
    }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
