const express = require("express");
const app = express();
const config = require("./config");
const createUser = require("./controllers/users/create.js");
const addContact = require("./controllers/users/addContact.js");
const deleteUser = require("./controllers/users/delete.js");
const userInfo = require("./controllers/users/userInfo.js");
const login = require("./controllers/authentication/login.js");
const logout = require("./controllers/authentication/logout.js");
const createDialogue = require("./controllers/dialogues/create.js");
const createPost = require("./controllers/posts/create.js");
const queryPage = require("./controllers/posts/queryPage.js");
const togglePostLike = require("./controllers/posts/toggleLike.js");
const swagger = require("./controllers/swagger/swagger.js");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const mongoDB = `mongodb+srv://admin:${config.mongoDbPass}@cluster0-y8qsw.mongodb.net/example_app?retryWrites=true`;

mongoose.connect(mongoDB, { useNewUrlParser: true })
    .then(db => console.log("Connected to database successfully!"))
    .catch(err => console.log("Unable to connect to the database. Error:", err));

app.use(express.static("../front/build"));
app.use(cookieParser());

app.use("/users", createUser);
app.use("/users", addContact);
app.use("/users", deleteUser);
app.use("/users", userInfo);
app.use("/authentication", login);
app.use("/authentication", logout);
app.use("/dialogues", createDialogue);
app.use("/posts", createPost);
app.use("/posts", queryPage);
app.use("/posts", togglePostLike);
app.use("/api-docs", swagger);

app.listen(config.port);
