const express = require("express");
const router = express.Router();
const userModel = require("../../models/user");
const helpers = require("../../helpers/helpers");

/**
 * @swagger
 *
 * /users/userinfo:
 *   get:
 *     description: Get information about user.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userName
 *         description: Username.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User info acquired.
 *       400:
 *         description: Error.
 *       401:
 *         description: Unauthorized.
 *     tags:
 *       - users
 */
router.get("/userinfo", (req, res) => {
    const cookie = req.cookies["exampleAppCookie"] || "";
    let userName = req.query.userName || "";
    userName = userName.replace(/[!@#$%^&*]/g, "");

    helpers.checkSession(userName, cookie)
        .then(
            () => userModel
                .findOne(
                    { "user_name": userName },
                    { first_name: 1, last_name: 1, contacts: 1, dialogues: 1, posts: 1, _id: 1 }
                )
        )
        .then(user => res.status(200).send(JSON.stringify(user)))
        .catch(err => res.sendStatus(parseInt(err.message) || 400));
});

module.exports = router;
