const express = require("express");
const router = express.Router();
const postModel = require("../../models/post");
const commentModel = require("../../models/postcomment");
const userModel = require("../../models/user");
const helpers = require("../../helpers/helpers");

/**
 * @swagger
 *
 * /posts/createComment:
 *   post:
 *     security:
 *       - cookieAuth: []
 *     summary: Create post comment.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentText:
 *                 type: string
 *             required:
 *               - commentText
 *     parameters:
 *       - in: query
 *         name: parentType
 *         description: Parent type.
 *         required: true
 *         schema:
 *           type: string
 *           enum: [post, comment]
 *       - in: query
 *         name: parentId
 *         description: Parent ID.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post comment created.
 *       400:
 *         description: Error.
 *     tags:
 *       - posts
 */
router.post("/createComment", (req, res) => {
    const cookie = req.cookies["exampleAppCookie"] || "";
    let parentType = req.query.parentType || "";
    let parentId = req.query.parentId || "";
    let commentText = req.body.commentText || "";
    const commentDate = Date.now();

    helpers.checkSession(cookie)
        .then(() => userModel.findOne({ "cookie": cookie }))
        .then(user => {
            if (!parentType || !parentId || !commentText) {
                throw new Error();
            } else {
                const comment = new commentModel(
                    {
                        author: user._id,
                        text: commentText,
                        date: commentDate,
                        comments: [],
                        likes: []
                    }
                );
                return comment;
            }
        })
        .then(comment => comment.save())
        .then(comment => {
                if (parentType === "post") {
                    return postModel.updateOne(
                        { "_id": parentId },
                        { $addToSet: { comments: comment._id } }
                    )
                } else if (parentType === "comment") {
                    return commentModel.updateOne(
                        { "_id": parentId },
                        { $addToSet: { comments: comment._id } }
                    )
                }
            })
        .then(document => res.sendStatus(200))
        .catch(error => res.sendStatus(400));
});

module.exports = router;
