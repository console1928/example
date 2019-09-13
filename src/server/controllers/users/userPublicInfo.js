const express = require("express");
const router = express.Router();
const userModel = require("../../models/user");

/**
 * @swagger
 *
 * /users/userPublicInfo:
 *   get:
 *     summary: Get public information about user.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: userId
 *         description: User's ID.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User public info acquired.
 *       400:
 *         description: Error.
 *     tags:
 *       - users
 */
router.get("/userPublicInfo", (req, res) => {
    let userId = req.query.userId || "";

    userModel.findOne(
        {"_id": userId },
        {
            _id: 1,
            name: 1,
            firstName: 1,
            lastName: 1,
            info: 1,
            picture: 1
        })
        .then(user => res.status(200).send(JSON.stringify(user)))
        .catch(error => res.sendStatus(parseInt(error.message) || 400));
});

module.exports = router;
