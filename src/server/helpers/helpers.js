const crypto = require("crypto");
const userModel = require("../models/user");

const authenticate = function (userName, password) {
    return new Promise(function (resolve, reject) {
        if (!userName || !password) {
            throw new Error();
        } else {
            resolve();
        }
    })
        .then(() => userModel.findOne({ "user_name": userName }))
        .then(user => {
            const { salt, hash } = user;
            const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512");
            if (crypto.timingSafeEqual(Buffer.from(hash), encryptHash)) {
                return;
            } else {
                throw new Error();
            }
        });
};

const checkSession = function (userName, cookie) {
    return new Promise(function (resolve, reject) {
        if (!userName || !cookie) {
            throw new Error("400");
        } else {
            resolve();
        }
    })
        .then(() => userModel.findOne({ "user_name": userName }))
        .then(user => {
            const actualCookie = user.cookie;
            if (cookie === actualCookie) {
                return;
            } else {
                throw new Error("401");
            }
        });
};

module.exports = { authenticate, checkSession };