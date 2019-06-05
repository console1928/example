const express = require("express");
const app = express();
const config = require("./config");
const users = require("./controllers/users.js");
const authentication = require("./controllers/authentication.js");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const mongoDB = `mongodb+srv://admin:${config.mongoDbPass}@cluster0-y8qsw.mongodb.net/example_app?retryWrites=true`;

mongoose.connect(mongoDB, { useNewUrlParser: true })
    .then(db => console.log("Connected to database successfully!"))
    .catch(err => console.log("Unable to connect to the database. Error:", err));

app.use(express.static("../front"));
app.use(cookieParser());

app.use("/users", users);
app.use("/authentication", authentication);

app.listen(config.port);
