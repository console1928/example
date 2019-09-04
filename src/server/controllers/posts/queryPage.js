const express = require("express");
const router = express.Router();
const postModel = require("../../models/post");

/**
 * @swagger
 *
 * /posts/queryPage:
 *   get:
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
 *       - in: query
 *         name: startDate
 *         description: Start Date.
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: searchValue
 *         description: Search value.
 *         required: false
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
router.get("/queryPage", (req, res) => {
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const startDate = req.query.startDate || Date.now();
    const searchValues = typeof req.query.searchValue === "string" ? [req.query.searchValue] : req.query.searchValue;
    const regexArray = searchValues
            ? searchValues.map(searchValue => new RegExp(searchValue.replace(/[!@#$%^&*\\]/g, ""), "i"))
            : [new RegExp()];

    if (limit > 0 && limit <= 20) {
        postModel
            .find({
                date: { $lte : new Date(startDate) },
                $or: [
                    { name: { $in : regexArray } },
                    { text: { $in : regexArray } }
                ]
            })
            .sort({ $natural: -1 })
            .skip(skip)
            .limit(limit)
            .then(posts => res.status(200).send(JSON.stringify(posts)))
            .catch(error => res.sendStatus(400));
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;
