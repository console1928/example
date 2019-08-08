const express = require("express");
const router = express.Router();
const postModel = require("../../models/post");
const userModel = require("../../models/user");
const helpers = require("../../helpers/helpers");

/**
 * @swagger
 *
 * /posts/toggleLike:
 *   post:
 *     security:
 *       - cookieAuth: []
 *     summary: Toggle post like.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: postId
 *         description: Post ID.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post like toggled.
 *       400:
 *         description: Error.
 *     tags:
 *       - posts
 */
router.post("/toggleLike", (req, res) => {
    const cookie = req.cookies["exampleAppCookie"] || "";
    let postId = req.query.postId || "";

    helpers.checkSession(cookie)
        .then(() => userModel.findOne({ "cookie": cookie }))
        .then(user => {
            if (!postId) {
                throw new Error();
            } else {
                return postModel
                    .findOne({ "_id": postId })
                    .then(post => {
                        if (post.likes.indexOf(user._id) === -1) {
                            return post.updateOne({ $push: { likes: user._id} });
                        } else {
                            return post.updateOne({ $pull: { likes: user._id} });
                        }
                    });
            }
        })
        .then(document => res.sendStatus(200))
        .catch(error => res.sendStatus(400));
});

module.exports = router;
