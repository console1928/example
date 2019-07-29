const express = require("express");
const router = express.Router();

/**
 * @swagger
 *
 * /authentication/logout:
 *   get:
 *     summary: Log out.
 *     responses:
 *       200:
 *         description: Logged out.
 *     tags:
 *       - authentication
 */
router.get("/logout", (req, res) => {
    res.clearCookie("exampleAppCookie");
    res.sendStatus(200);
});

module.exports = router;
