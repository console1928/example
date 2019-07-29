const express = require("express");
const router = express.Router();
const userModel = require("../../models/user");
const helpers = require("../../helpers/helpers");

/**
 * @swagger
 *
 * /users/delete:
 *   delete:
 *     security:
 *       - cookieAuth: []
 *     summary: Delete user.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: userName
 *         description: Username.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted.
 *       400:
 *         description: Error.
 *     tags:
 *       - users
 */
router.delete("/delete", (req, res) => {
    const cookie = req.cookies["exampleAppCookie"] || "";
    let userName = req.query.userName || "";
    userName = userName.replace(/[!@#$%^&*]/g, "");

    helpers.checkSession(userName, cookie)
        .then(() => userModel.findOne({ "user_name": userName }))
        .then(user => {
            if (!userName || user === null) {
                throw new Error();
            }
            return user;
        })
        .then(user => user.remove())
        .then(document => res.sendStatus(200))
        .catch(err => res.sendStatus(400));
});

module.exports = router;
