const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../../.env' });

const DatabaseManager = require('./DatabaseManager');

let db;

if (process.env.DB_TYPE === 'mongodb') {
    const MongoDatabaseManager = require('./mongodb');
    db = new MongoDatabaseManager(); 
} else if (process.env.DB_TYPE === 'postgresql') {
    const PostgresDatabaseManager = require('./postgresql');
    db = new PostgresDatabaseManager();
} else {
    console.error('No DB_TYPE specified in .env');
    process.exit(1);
}

module.exports = db;
