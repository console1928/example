const express = require("express");
const router = express.Router();
const dialogueModel = require("../../models/dialogue");
const userModel = require("../../models/user");
const helpers = require("../../helpers/helpers");

/**
 * @swagger
 *
 * /dialogues/create:
 *   post:
 *     security:
 *       - cookieAuth: []
 *     summary: Create dialogue.
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
 *         name: dialogueName
 *         description: Dialogue name.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: dialoguePicture
 *         description: Dialogue picture.
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dialogue created.
 *       400:
 *         description: Error.
 *     tags:
 *       - dialogues
 */
router.post("/create", (req, res) => {
    const cookie = req.cookies["exampleAppCookie"] || "";
    let userName = req.query.userName || "";
    let dialogueName = req.query.dialogueName || "";
    const dialoguePicture = req.query.dialoguePicture || "";
    userName = userName.replace(/[!@#$%^&*]/g, "");

    helpers.checkSession(userName, cookie)
        .then(() => {
            if (
                !userName ||
                !postName ||
                !postText
            ) {
                throw new Error();
            } else {
                const dialogue = new dialogueModel(
                    {
                        dialogue_name: dialogueName,
                        dialogue_picture: dialoguePicture,
                        messages: []
                    }
                );
                return dialogue;
            }
        })
        .then(dialogue => dialogue.save())
        .then(dialogue =>
            userModel.updateOne(
                { "user_name": userName },
                { $addToSet: { dialogues: dialogue._id } }
            )
        )
        .then(document => res.sendStatus(200))
        .catch(err => res.sendStatus(400));
});

module.exports = router;
