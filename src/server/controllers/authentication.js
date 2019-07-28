const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const helpers = require("../helpers/helpers");

/**
 * @swagger
 *
 * /authentication/login:
 *   get:
 *     description: Login to the application.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userName
 *         description: Username to use for login.
 *         in: query
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: query
 *         required: true
 *         type: string
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

/**
 * @swagger
 *
 * /authentication/logout:
 *   get:
 *     description: Log out.
 *     responses:
 *       200:
 *         description: Logged out.
 *     tags:
 *       - authentication
 */
router.get("/logout", (req, res) => {
    res.clearCookie("exampleAppCookie");
    res.sendStatus(200);
});

module.exports = router;
