const express = require("express");
const router = express.Router();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "Example API",
            version: "1.0.0",
            description: "Example API autogenerated swagger doc",
        },
    },
    apis: [
        "./controllers/authentication/login.js",
        "./controllers/authentication/logout.js",
        "./controllers/users/addContact.js",
        "./controllers/users/create.js",
        "./controllers/users/delete.js",
        "./controllers/users/userInfo.js",
        "./controllers/users/userPublicInfo.js",
        "./controllers/dialogues/create.js",
        "./controllers/posts/create.js",
        "./controllers/posts/queryPage.js",
        "./controllers/posts/toggleLike.js",
        "./controllers/posts/createComment.js",
        "./controllers/posts/queryComments.js",
        "./controllers/posts/toggleCommentLike.js",
        "./controllers/utils/sendFeedback.js"
    ]
};

const specs = swaggerJsdoc(options);

router.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
});

router.use("/", swaggerUi.serve, swaggerUi.setup(specs));

module.exports = router;
