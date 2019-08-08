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
    let dialogueName = req.query.dialogueName || "";
    const dialoguePicture = req.query.dialoguePicture || "";

    helpers.checkSession(cookie)
        .then(() => {
            if (!postName || !postText) {
                throw new Error();
            } else {
                const dialogue = new dialogueModel(
                    {
                        name: dialogueName,
                        picture: dialoguePicture,
                        messages: []
                    }
                );
                return dialogue;
            }
        })
        .then(dialogue => dialogue.save())
        .then(dialogue =>
            userModel.updateOne(
                { "cookie": cookie },
                { $addToSet: { dialogues: dialogue._id } }
            )
        )
        .then(document => res.sendStatus(200))
        .catch(error => res.sendStatus(400));
});

module.exports = router;
