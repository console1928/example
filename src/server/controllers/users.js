const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const userModel = require("../models/user");
const helpers = require("../helpers/helpers");

router.get("/create", (req, res) => {
    const password = req.query.password || "";
    const firstName = req.query.firstName || "";
    const lastName = req.query.lastName || "";
    const userPicture = req.query.userPicture || "";
    let userName = req.query.userName || "";
    userName = userName.replace(/[!@#$%^&*]/g, "");

    userModel
        .findOne({ "user_name": userName })
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
                        user_name: userName,
                        first_name: firstName,
                        last_name: lastName,
                        user_picture: userPicture,
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

router.get("/userinfo", (req, res) => {
    const cookie = req.cookies["exampleAppCookie"] || "";
    let userName = req.query.userName || "";
    userName = userName.replace(/[!@#$%^&*]/g, "");

    helpers.checkSession(userName, cookie)
        .then(() => userModel.findOne({ "user_name": userName }, { first_name: 1, last_name: 1 }))
        .then(user => res.status(200).send(JSON.stringify(user)))
        .catch(err => res.sendStatus(parseInt(err.message) || 400));
});

module.exports = router;
