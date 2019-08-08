const express = require("express");
const router = express.Router();
const userModel = require("../../models/user");
const helpers = require("../../helpers/helpers");

/**
 * @swagger
 *
 * /users/userinfo:
 *   get:
 *     security:
 *       - cookieAuth: []
 *     summary: Get information about user.
 *     produces:
 *       - application/json
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

    helpers.checkSession(cookie)
        .then(
            () => userModel
                .findOne(
                    { "cookie": cookie },
                    { _id: 1, name: 1, firstName: 1, lastName: 1, contacts: 1, dialogues: 1, posts: 1 }
                )
        )
        .then(user => res.status(200).send(JSON.stringify(user)))
        .catch(error => res.sendStatus(parseInt(error.message) || 400));
});

module.exports = router;
