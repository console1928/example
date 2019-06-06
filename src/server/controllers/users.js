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
        .then(
            () => userModel
                .findOne(
                    { "user_name": userName },
                    { first_name: 1, last_name: 1, contacts: 1, dialogues: 1, posts: 1, _id: 1 }
                )
        )
        .then(user => res.status(200).send(JSON.stringify(user)))
        .catch(err => res.sendStatus(parseInt(err.message) || 400));
});

router.get("/addcontact", (req, res) => {
    const cookie = req.cookies["exampleAppCookie"] || "";
    let userName = req.query.userName || "";
    let newContact = req.query.newContact || "";
    userName = userName.replace(/[!@#$%^&*]/g, "");
    newContact = newContact.replace(/[!@#$%^&*]/g, "");

    helpers.checkSession(userName, cookie)
        .then(() => Promise.all([
            userModel.findOne({ "user_name": userName }),
            userModel.findOne({ "user_name": newContact })
        ]))
        .then(users => {
            if (!newContact || !userName || users[0] === null || users[1] === null) {
                throw new Error();
            } else if (
                users[0].contacts && users[0].contacts.indexOf(users[1]._id) !== -1 ||
                users[1].contacts && users[1].contacts.indexOf(users[0]._id) !== -1
            ) {
                throw new Error();
            }
            return users;
        })
        .then(users => Promise.all([
            userModel.updateOne({ "user_name": userName }, { $push: { "contacts": users[1]._id } }),
            userModel.updateOne({ "user_name": newContact }, { $push: { "contacts": users[0]._id } })
        ]))
        .then(users => res.sendStatus(200))
        .catch(err => res.sendStatus(parseInt(err.message) || 400));
});

module.exports = router;
