const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const userModel = require("../models/user");

router.get("/login", (req, res) => {
    const password = req.query.password || "";
    let userName = req.query.userName || "";
    userName = userName.replace(/[!@#$%^&*]/g, "");

    if (!userName || !password) {
        res.sendStatus(400);
    } else {
        const randomNumber = Math.random().toString();
        const cookie = randomNumber.substring(2, randomNumber.length);
        userModel.findOne({ "user_name": userName })
            .then(user => {
                const { salt, hash } = user;
                const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512");
                if (crypto.timingSafeEqual(Buffer.from(hash), encryptHash)) {
                    return userModel.updateOne({ "user_name": userName }, { $set: { "cookie": cookie } });
                } else {
                    throw new Error();
                }
            })
            .then(document => {
                res.cookie("exampleAppCookie", cookie, { maxAge: 900000, httpOnly: true });
                res.sendStatus(200);
            })
            .catch(err => res.sendStatus(400));
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("exampleAppCookie");
    res.sendStatus(200);
});

module.exports = router;
