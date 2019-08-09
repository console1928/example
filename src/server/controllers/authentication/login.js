const express = require("express");
const router = express.Router();
const userModel = require("../../models/user");
const helpers = require("../../helpers/helpers");

/**
 * @swagger
 *
 * /authentication/login:
 *   post:
 *     summary: Login to the application.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - userName
 *               - password
 *     responses:
 *       200:
 *         description: Logged in.
 *       400:
 *         description: Error.
 *     tags:
 *       - authentication
 */
router.post("/login", (req, res) => {
    const randomNumber = Math.random().toString();
    const cookie = randomNumber.substring(2, randomNumber.length);
    const password = req.body.password || "";
    let userName = req.body.userName || "";
    userName = userName.replace(/[!@#$%^&*]/g, "");

    helpers.authenticate(userName, password)
        .then(() => userModel.updateOne({ "name": userName }, { $set: { "cookie": cookie } }))
        .then(document => {
            res.cookie("exampleAppCookie", cookie, { maxAge: 86400000, httpOnly: true });
            res.sendStatus(200);
        })
        .catch(error => res.sendStatus(400));
});

module.exports = router;
