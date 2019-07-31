const express = require("express");
const router = express.Router();
const postModel = require("../../models/post");
const userModel = require("../../models/user");
const helpers = require("../../helpers/helpers");

/**
 * @swagger
 *
 * /posts/create:
 *   post:
 *     security:
 *       - cookieAuth: []
 *     summary: Create post.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: userName
 *         description: Username.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: postName
 *         description: Post name.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: postText
 *         description: Post text.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post created.
 *       400:
 *         description: Error.
 *     tags:
 *       - posts
 */
router.post("/create", (req, res) => {
    const cookie = req.cookies["exampleAppCookie"] || "";
    let userName = req.query.userName || "";
    let postName = req.query.postName || "";
    let postText = req.query.postText || "";
    userName = userName.replace(/[!@#$%^&*]/g, "");

    helpers.checkSession(userName, cookie)
        .then(user => {
            if (
                !userName ||
                !postName ||
                !postText
            ) {
                throw new Error();
            } else {
                const post = new postModel(
                    {
                        post_author: userName,
                        post_name: postName,
                        post_text: postText,
                        post_comments: []
                    }
                );
                return post;
            }
        })
        .then(post => post.save())
        .then(post =>
            userModel.updateOne(
                { "user_name": userName },
                { $addToSet: { posts: post._id } }
            )
        )
        .then(document => res.sendStatus(200))
        .catch(err => res.sendStatus(400));
});

module.exports = router;
