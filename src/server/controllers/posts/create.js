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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postName:
 *                 type: string
 *               postText:
 *                 type: string
 *             required:
 *               - postName
 *               - postText
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
    let postName = req.body.postName || "";
    let postText = req.body.postText || "";
    const postDate = Date.now();

    helpers.checkSession(cookie)
        .then(() => userModel.findOne({ "cookie": cookie }))
        .then(user => {
            if (!postName || !postText) {
                throw new Error();
            } else {
                const post = new postModel(
                    {
                        author: user._id,
                        name: postName,
                        text: postText,
                        date: postDate,
                        comments: [],
                        likes: []
                    }
                );
                return post;
            }
        })
        .then(post => post.save())
        .then(post =>
            userModel.updateOne(
                { "cookie": cookie },
                { $addToSet: { posts: post._id } }
            )
        )
        .then(document => res.sendStatus(200))
        .catch(error => res.sendStatus(400));
});

module.exports = router;
