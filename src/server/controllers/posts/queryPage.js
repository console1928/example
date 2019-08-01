const express = require("express");
const router = express.Router();
const postModel = require("../../models/post");

/**
 * @swagger
 *
 * /posts/queryPage:
 *   post:
 *     summary: Query posts chunk.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: skip
 *         description: Skip.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         description: Limit.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Posts chunk acquired.
 *       400:
 *         description: Error.
 *     tags:
 *       - posts
 */
router.post("/queryPage", (req, res) => {
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;

    if (limit > 0 && limit <= 20) {
        postModel.find().skip(skip).limit(limit)
            .then(post => res.status(200).send(JSON.stringify(post)))
            .catch(err => res.sendStatus(400));
    }
});

module.exports = router;
