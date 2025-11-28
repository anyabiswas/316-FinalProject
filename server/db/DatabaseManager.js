

class DatabaseManager {
    async connect() {
        throw new Error('connect() must be implemented by subclass');
    }

    async disconnect() {
        throw new Error('disconnect() must be implemented by subclass');
    }

    async createUser(userData) {
        throw new Error('createUser() must be implemented by subclass');
    }

    async findUserByEmail(email) {
        throw new Error('findUserByEmail() must be implemented by subclass');
    }

    async createPlaylist(playlistData) {
        throw new Error('createPlaylist() must be implemented by subclass');
    }

    async getAllPlaylists(userId) {
        throw new Error('getAllPlaylists() must be implemented by subclass');
    }

    async updatePlaylist(id, updateData) {
        throw new Error('updatePlaylist() must be implemented by subclass');
    }

    async deletePlaylist(id) {
        throw new Error('deletePlaylist() must be implemented by subclass');
    }
}

module.exports = DatabaseManager;