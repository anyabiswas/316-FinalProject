
const { Sequelize, DataTypes } = require('sequelize');
const DatabaseManager = require('../DatabaseManager');

const sequelize = new Sequelize(process.env.PG_URI, {
    dialect: 'postgres',
    logging: false, 
});


const User = sequelize.define('User', {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false }
  }, { timestamps: true });
  
const Playlist = sequelize.define('Playlist', {
    name: { type: DataTypes.STRING, allowNull: false },
    ownerEmail: { type: DataTypes.STRING, allowNull: false },
    songs: { type: DataTypes.JSONB, defaultValue: [] },
}, { timestamps: true });


User.hasMany(Playlist, { foreignKey: 'ownerEmail', sourceKey: 'email' });
Playlist.belongsTo(User, { foreignKey: 'ownerEmail', targetKey: 'email' });

class PostgresDatabaseManager extends DatabaseManager {
    async connect() { 
        await sequelize.authenticate(); 
        await sequelize.sync({ alter:true });
        console.log('Connected to PostgreSQL');
    }

    async disconnect() { await sequelize.close(); console.log('Disconnected'); }
    async createUser(userData) { return await User.create(userData); }
    async findUserByEmail(email) { return await User.findOne({ where: { email } }); }

    async createPlaylist(data) {
        const user = await User.findOne({ where: { email: data.ownerEmail } });
        if (!user) throw new Error('User not found');
        return await Playlist.create(data);
    }

    async getAllPlaylists(userEmail) {
        return await Playlist.findAll({ where: { ownerEmail: userEmail } });
    }

    async getPlaylistById(id) {
        return await Playlist.findByPk(id);
    }

    async updatePlaylist(id, updateData) {
        const playlist = await Playlist.findByPk(id);
        if (!playlist) throw new Error('Playlist not found');
        await playlist.update(updateData);
        return playlist;
    }

    async deletePlaylist(id) {
        const playlist = await Playlist.findByPk(id);
        if (!playlist) throw new Error('Playlist not found');
        await playlist.destroy();
        return playlist;
    }
}

module.exports = PostgresDatabaseManager;
