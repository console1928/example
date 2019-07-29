const express = require("express");
const router = express.Router();
const userModel = require("../../models/user");
const helpers = require("../../helpers/helpers");

/**
 * @swagger
 *
 * /authentication/login:
 *   get:
 *     summary: Login to the application.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: userName
 *         description: Username to use for login.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: password
 *         description: User's password.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Logged in.
 *       400:
 *         description: Error.
 *     tags:
 *       - authentication
 */
router.get("/login", (req, res) => {
    const randomNumber = Math.random().toString();
    const cookie = randomNumber.substring(2, randomNumber.length);
    const password = req.query.password || "";
    let userName = req.query.userName || "";
    userName = userName.replace(/[!@#$%^&*]/g, "");

    helpers.authenticate(userName, password)
        .then(() => userModel.updateOne({ "user_name": userName }, { $set: { "cookie": cookie } }))
        .then(document => {
            res.cookie("exampleAppCookie", cookie, { maxAge: 900000, httpOnly: true });
            res.sendStatus(200);
        })
        .catch(err => res.sendStatus(400));
});

module.exports = router;
