require("dotenv").config();

const config = {
    db:{
        username:process.env.DB_USERNAME,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME
    },
};

module.exports = config;
