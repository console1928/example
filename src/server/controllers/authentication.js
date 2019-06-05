const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const helpers = require("../helpers/helpers");

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

router.get("/logout", (req, res) => {
    res.clearCookie("exampleAppCookie");
    res.sendStatus(200);
});

module.exports = router;
