const express = require("express");
const router = express.Router();
const postModel = require("../../models/post");
const commentModel = require("../../models/postcomment");

/**
 * @swagger
 *
 * /posts/queryComments:
 *   get:
 *     summary: Query comments.
 *     produces:
 *       - application/json
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
 *         description: Post comments acquired.
 *       400:
 *         description: Error.
 *     tags:
 *       - posts
 */
router.get("/queryComments", (req, res) => {
    let parentType = req.query.parentType || "";
    let parentId = req.query.parentId || "";
    
    if (!parentType || !parentId) {
        res.sendStatus(400);
    } else {
        const model = parentType === "post" ? postModel : commentModel;
        return model.findOne({ _id: parentId })
                .then(parent => commentModel.find({ _id: parent.comments }))
                .then(comments => res.status(200).send(JSON.stringify(comments)))
                .catch(error => res.sendStatus(400));
    }
});

module.exports = router;
