const express = require("express");
const router = express.Router();
const commentModel = require("../../models/postcomment");
const userModel = require("../../models/user");
const helpers = require("../../helpers/helpers");

/**
 * @swagger
 *
 * /posts/toggleCommentLike:
 *   post:
 *     security:
 *       - cookieAuth: []
 *     summary: Toggle comment like.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: commentId
 *         description: Comment ID.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment like toggled.
 *       400:
 *         description: Error.
 *     tags:
 *       - posts
 */
router.post("/toggleCommentLike", (req, res) => {
    const cookie = req.cookies["exampleAppCookie"] || "";
    let commentId = req.query.commentId || "";

    helpers.checkSession(cookie)
        .then(() => userModel.findOne({ "cookie": cookie }))
        .then(user => {
            if (!commentId) {
                throw new Error();
            } else {
                return commentModel
                    .findOne({ "_id": commentId })
                    .then(comment => {
                        if (comment.likes.indexOf(user._id) === -1) {
                            return comment.updateOne({ $push: { likes: user._id} });
                        } else {
                            return comment.updateOne({ $pull: { likes: user._id} });
                        }
                    });
            }
        })
        .then(document => res.sendStatus(200))
        .catch(error => res.sendStatus(400));
});

module.exports = router;
