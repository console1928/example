const express = require("express");
const router = express.Router();
const feedbackModel = require("../../models/feedback");
const userModel = require("../../models/user");
const helpers = require("../../helpers/helpers");

/**
 * @swagger
 *
 * /utils/feedback:
 *   post:
 *     summary: Send feedback.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feedbackText:
 *                 type: string
 *             required:
 *               - feedbackText
 *     responses:
 *       200:
 *         description: Feedback sent.
 *       400:
 *         description: Error.
 *     tags:
 *       - utils
 */
router.post("/feedback", (req, res) => {
    const cookie = req.cookies["exampleAppCookie"] || "";
    let feedbackText = req.body.feedbackText || "";
    const postDate = Date.now();

    new Promise(function (resolve, reject) {
            if (cookie) {
                resolve(
                    helpers.checkSession(cookie)
                        .then(() => userModel.findOne({ "cookie": cookie }))
                );
            } else {
                resolve({ _id: "anonymous" });
            }
        })
        .then(user => {
            if (!feedbackText) {
                throw new Error();
            } else {
                const feedback = new feedbackModel(
                    {
                        author: user._id,
                        text: feedbackText,
                        date: postDate
                    }
                );
                return feedback;
            }
        })
        .then(feedback => feedback.save())
        .then(document => res.sendStatus(200))
        .catch(error => res.sendStatus(400));
});

module.exports = router;
