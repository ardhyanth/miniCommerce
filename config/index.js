require('dotenv').config();

const config = {
    db: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    openApiKey: process.env.ELEVENIA_KEY
}

module.exports = config;
