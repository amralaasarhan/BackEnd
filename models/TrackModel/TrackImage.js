const { MongoClient } = require('mongodb');

class TrackImageModel {
  constructor() {
    this.db = null;
    this.collectionName = 'Track';
    this.uri = 'mongodb://localhost:27017/ProjectDB';
  }

  async getConnection() {
    const MongoClient = require("mongodb").MongoClient
    const uri = "mongodb://127.0.0.1:27017"
    const connect = await new MongoClient(uri).connect()
    const ProjectDB = connect.db("ProjectDB")
    const TrackCollection = await ProjectDB.collection("Track")
    return TrackCollection
  }


  async insertTrackImage(imageData, trackId) {
    try {

      const TrackImageCollection = await this.getConnection()
      const result = await TrackImageCollection.insertOne({
        image: imageData,
        trackId: trackId,
      });
      return result.insertedId;
    } catch (error) {
      console.error('Error inserting profile picture:', error);
      throw error;
    }
  }

  async getTrackImageByID(trackId) {
    const TrackImageCollection = await this.getConnection()
    const result = await TrackImageCollection.findOne({
      trackId: trackId,
    });

    return result;

  } catch(error) {
    console.error('Error getting Track Image by ID:', error);
    throw error;
  }


  async updateTrackImageByID(trackId, newImageData) {
    try {

      const TrackImageCollection = await this.getConnection()
      const result = await TrackImageCollection.updateOne(
        { "trackId": trackId },
        { $set: { "image": newImageData } }
      );

      return result.modifiedCount;
    } catch (error) {
      console.error('Error updating profile picture by ID:', error);
      throw error;
    }
  }

  async deleteTrackImageByID(trackId) {
    try {
      const TrackImageCollection = await this.getConnection()
        console.log('Connection to database established successfully.');

        const result = await TrackImageCollection.deleteOne({ "trackId": trackId });
        console.log('Result of findOneAndDelete:', result);

        if (!result || result.deletedCount === 0) {
            console.log(`No Track Image with ID ${trackId} found.`);
            return 0; // No document found, return 0 to indicate deletion failure
        }
        
        console.log(`Track Image with ID ${trackId} deleted successfully.`);
        return 1; // Document found and deleted, return 1 to indicate successful deletion
    } catch(error) {
        console.error('Error deleting Course Image by ID:', error);
        throw error;
    }
}

}

exports.default = TrackImageModel;
