require("dotenv").config({ path: "../../.env" });

const mongoDbPass = process.env.MONGO_DB_PASS;
const port = process.env.PORT || 3000;

const config = {
    mongoDbPass,
    port
};

module.exports = config;
