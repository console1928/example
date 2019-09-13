const express = require("express");
const app = express();
const config = require("./config");
const createUser = require("./controllers/users/create.js");
const addContact = require("./controllers/users/addContact.js");
const deleteUser = require("./controllers/users/delete.js");
const userInfo = require("./controllers/users/userInfo.js");
const userPublicInfo = require("./controllers/users/userPublicInfo.js");
const setUserInfo = require("./controllers/users/setInfo.js");
const setUserPicture = require("./controllers/users/setPicture.js");
const login = require("./controllers/authentication/login.js");
const logout = require("./controllers/authentication/logout.js");
const createDialogue = require("./controllers/dialogues/create.js");
const createPost = require("./controllers/posts/create.js");
const queryPage = require("./controllers/posts/queryPage.js");
const togglePostLike = require("./controllers/posts/toggleLike.js");
const createComment = require("./controllers/posts/createComment.js");
const queryComments = require("./controllers/posts/queryComments.js");
const toggleCommentLike = require("./controllers/posts/toggleCommentLike.js");
const sendFeedback = require("./controllers/utils/sendFeedback.js");
const swagger = require("./controllers/swagger/swagger.js");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const mongoDB = `mongodb+srv://admin:${config.mongoDbPass}@cluster0-y8qsw.mongodb.net/example_app?retryWrites=true`;

mongoose.connect(mongoDB, { useNewUrlParser: true })
    .then(db => console.log("Connected to database successfully!"))
    .catch(err => console.log("Unable to connect to the database. Error:", err));

app.use("/", express.static("../front/build"));
app.use("/posts", express.static("../front/build"));
app.use("/user", express.static("../front/build"));
app.use(cookieParser());
app.use(express.json());

app.use("/users", createUser);
app.use("/users", addContact);
app.use("/users", deleteUser);
app.use("/users", userInfo);
app.use("/users", userPublicInfo);
app.use("/users", setUserInfo);
app.use("/users", setUserPicture);
app.use("/authentication", login);
app.use("/authentication", logout);
app.use("/dialogues", createDialogue);
app.use("/posts", createPost);
app.use("/posts", queryPage);
app.use("/posts", togglePostLike);
app.use("/posts", createComment);
app.use("/posts", queryComments);
app.use("/posts", toggleCommentLike);
app.use("/utils", sendFeedback);

app.use("/api-docs", swagger);

app.listen(config.port);
