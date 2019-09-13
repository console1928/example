const express = require("express");
const router = express.Router();
const userModel = require("../../models/user");
const helpers = require("../../helpers/helpers");

/**
 * @swagger
 *
 * /users/setPicture:
 *   post:
 *     security:
 *       - cookieAuth: []
 *     summary: Set user's profile picture.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userPicture:
 *                 type: string
 *             required:
 *               - userPicture
 *     responses:
 *       200:
 *         description: User picture is set.
 *       400:
 *         description: Error.
 *       401:
 *         description: Unauthorized.
 *     tags:
 *       - users
 */
router.post("/setPicture", (req, res) => {
    const cookie = req.cookies["exampleAppCookie"] || "";
    const userPicture = req.body.userPicture || "";

    helpers.checkSession(cookie)
        .then(() => userModel.findOneAndUpdate(
                { "cookie": cookie },
                { $set: { "picture": userPicture } },
                {
                    projection: {
                        _id: 1,
                        name: 1,
                        firstName: 1,
                        lastName: 1,
                        contacts: 1,
                        dialogues: 1,
                        posts: 1,
                        info: 1,
                        picture: 1
                    },
                    new: true
                }
            ))
        .then(user => res.status(200).send(JSON.stringify(user)))
        .catch(error => res.sendStatus(parseInt(error.message) || 400));
});

module.exports = router;
