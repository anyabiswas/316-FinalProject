const dotenv = require('dotenv').config({ path: __dirname + '/../../../.env' });
const { Sequelize, DataTypes } = require('sequelize');
const testData = require('../example-db-data.json');


const sequelize = new Sequelize(process.env.PG_URI, {
    dialect: 'postgres',
    logging: false,
});

// Define models
const User = sequelize.define('User', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

const Playlist = sequelize.define('Playlist', {
    name: { type: DataTypes.STRING, allowNull: false },
    ownerEmail: { type: DataTypes.STRING, allowNull: false },
    songs: { type: DataTypes.JSONB, defaultValue: [] },
}, { timestamps: true });


User.hasMany(Playlist, { foreignKey: 'ownerEmail', sourceKey: 'email' });
Playlist.belongsTo(User, { foreignKey: 'ownerEmail', targetKey: 'email' });

async function resetPostgre() {
console.log("Resetting the PostgreSQL DB");


try {
   
    await sequelize.sync({ force: true });
    console.log("All tables cleared and recreated");

    const userMap = {}; 

    
    console.log("Filling User table...");
    for (const userData of testData.users) {
        const user = await User.create({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            passwordHash: userData.passwordHash
        });
        userMap[user.email] = user.id;
    }
    console.log("User table filled");


    console.log("Filling Playlist table...");
    for (const playlistData of testData.playlists) {
        if (userMap[playlistData.ownerEmail]) {
            await Playlist.create({
                name: playlistData.name,
                ownerEmail: playlistData.ownerEmail,
                songs: playlistData.songs
            });
        } else {
            console.warn(`Skipping playlist "${playlistData.name}" - owner email ${playlistData.ownerEmail} not found.`);
        }
    }
    console.log("Playlist table filled");

    console.log("PostgreSQL database reset complete!");
} catch (err) {
    console.error('Error resetting PostgreSQL DB:', err);
} finally {
    await sequelize.close();
    console.log('PostgreSQL connection closed.');
}


}


sequelize.authenticate()
    .then(() => {
    console.log('PostgreSQL connection established successfully.');
    resetPostgre();
})
.catch(e => {
    console.error('Unable to connect to the PostgreSQL database:', e);
});
