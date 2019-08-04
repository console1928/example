const express = require("express");
const router = express.Router();
const userModel = require("../../models/user");
const helpers = require("../../helpers/helpers");

/**
 * @swagger
 *
 * /users/addcontact:
 *   get:
 *     security:
 *       - cookieAuth: []
 *     summary: Add contact.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: newContact
 *         description: User's new contact.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: New contact added to user.
 *       400:
 *         description: Error.
 *       401:
 *         description: Unauthorized.
 *     tags:
 *       - users
 */
router.get("/addcontact", (req, res) => {
    const cookie = req.cookies["exampleAppCookie"] || "";
    let newContact = req.query.newContact || "";
    newContact = newContact.replace(/[!@#$%^&*]/g, "");

    helpers.checkSession(cookie)
        .then(() => Promise.all([
            userModel.findOne({ "cookie": cookie }),
            userModel.findOne({ "name": newContact })
        ]))
        .then(users => {
            if (!newContact || users[0] === null || users[1] === null) {
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
            userModel.updateOne({ "cookie": cookie }, { $push: { "contacts": users[1]._id } }),
            userModel.updateOne({ "name": newContact }, { $push: { "contacts": users[0]._id } })
        ]))
        .then(users => res.sendStatus(200))
        .catch(err => res.sendStatus(parseInt(err.message) || 400));
});

module.exports = router;
