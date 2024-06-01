const { MongoClient } = require('mongodb');

class ProfilePictureModel {
  constructor() {
    this.db = null;
    this.collectionName = 'ProfilePictures';
    this.uri = 'mongodb://localhost:27017/ProjectDB';
  }

  async connectToDatabase() {
    const client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
      await client.connect();
      this.db = client.db();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  async insertProfilePicture(imageData, SQLRecordID) {
    try {
      if (!this.db) {
        await this.connectToDatabase();
      }

      const profilePicturesCollection = this.db.collection(this.collectionName);
      const result = await profilePicturesCollection.insertOne({
        image: imageData,
        SQLRecordID: SQLRecordID,
      });

      return result.insertedId;
    } catch (error) {
      console.error('Error inserting profile picture:', error);
      throw error;
    }
  }

  async getProfilePictureByID(SQLRecordID) {
    try {
      if (!this.db) {
        await this.connectToDatabase();
      }

      const profilePicturesCollection = this.db.collection(this.collectionName);
      const result = await profilePicturesCollection.findOne({
        SQLRecordID: SQLRecordID,
      });

      return result;
    } catch (error) {
      console.error('Error getting profile picture by ID:', error);
      throw error;
    }
  }

  async deleteProfilePictureByID(SQLRecordID) {
    try {
      if (!this.db) {
        await this.connectToDatabase();
      }

      const profilePicturesCollection = this.db.collection(this.collectionName);
      const result = await profilePicturesCollection.deleteOne({
        SQLRecordID: SQLRecordID,
      });

      return result.deletedCount;
    } catch (error) {
      console.error('Error deleting profile picture by ID:', error);
      throw error;
    }
  }

  async updateProfilePictureByID(SQLRecordID, newImageData) {
    try {
      if (!this.db) {
        await this.connectToDatabase();
      }

      const profilePicturesCollection = this.db.collection(this.collectionName);
      const result = await profilePicturesCollection.updateOne(
        { SQLRecordID: SQLRecordID },
        { $set: { image: newImageData } }
      );

      return result.modifiedCount;
    } catch (error) {
      console.error('Error updating profile picture by ID:', error);
      throw error;
    }
  }
}

exports.default = ProfilePictureModel;
