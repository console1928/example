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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *             required:
 *               - userName
 *               - password
 *               - firstName
 *               - lastName
 *     responses:
 *       200:
 *         description: User created.
 *       400:
 *         description: Error.
 *     tags:
 *       - users
 */
router.post("/create", (req, res) => {
    const password = req.body.password || "";
    const firstName = req.body.firstName || "";
    const lastName = req.body.lastName || "";
    let userName = req.body.userName || "";
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
                        salt: salt,
                        hash: hash
                    }
                );
                return user;
            }
        })
        .then(user => user.save())
        .then(document => res.sendStatus(200))
        .catch(error => res.sendStatus(400));
});

module.exports = router;
