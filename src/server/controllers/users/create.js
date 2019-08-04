const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const userModel = require("../../models/user");

/**
 * @swagger
 *
 * /users/create:
 *   post:
 *     summary: Create user.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: userName
 *         description: Username.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: password
 *         description: User's password.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: firstName
 *         description: User's first name.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: lastName
 *         description: User's last name.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userPicture
 *         description: User's picture.
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User created.
 *       400:
 *         description: Error.
 *     tags:
 *       - users
 */
router.post("/create", (req, res) => {
    const password = req.query.password || "";
    const firstName = req.query.firstName || "";
    const lastName = req.query.lastName || "";
    const userPicture = req.query.userPicture || "";
    let userName = req.query.userName || "";
    userName = userName.replace(/[!@#$%^&*]/g, "");

    userModel
        .findOne({ "name": userName })
        .then(user => {
            if (
                !firstName ||
                !lastName ||
                !userName ||
                !password ||
                user !== null
            ) {
                throw new Error();
            } else {
                const salt = crypto.randomBytes(128).toString("base64");
                const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512");
                const user = new userModel(
                    {
                        name: userName,
                        firstName: firstName,
                        lastName: lastName,
                        picture: userPicture,
                        salt: salt,
                        hash: hash
                    }
                );
                return user;
            }
        })
        .then(user => user.save())
        .then(document => res.sendStatus(200))
        .catch(err => res.sendStatus(400));
});

module.exports = router;
