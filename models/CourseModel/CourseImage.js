const { MongoClient } = require('mongodb');

class CourseImageModel {
  constructor() {
    this.db = null;
    this.collectionName = 'Course';
    this.uri = 'mongodb://localhost:27017/ProjectDB';
  }

  async getConnection() {
    const MongoClient = require("mongodb").MongoClient
    const uri = "mongodb://127.0.0.1:27017"
    const connect = await new MongoClient(uri).connect()
    const ProjectDB = connect.db("ProjectDB")
    const CourseImageCollection = await ProjectDB.collection("Course")
    return CourseImageCollection
  }



  async insertCourseImage(courseId, imageData) {
    try {

      const CourseImageCollection = await this.getConnection()
      const result = await CourseImageCollection.insertOne({
        image: imageData,
        courseId: courseId,
      });
      return result.insertedId;
    } catch (error) {
      console.error('Error inserting profile picture:', error);
      throw error;
    }
  }

  async getCourseImageByID(courseId) {
    const CourseImageCollection = await this.getConnection()
    const result = await CourseImageCollection.findOne({
      courseId: courseId,
    });

    return result;

  } catch(error) {
    console.error('Error getting Track Image by ID:', error);
    throw error;
  }

  async updateCourseImageByID(courseId, newImageData) {
    try {

      const CourseImageCollection = await this.getConnection()
      const result = await CourseImageCollection.updateOne(
        { "courseId": courseId },
        { $set: { "image": newImageData } }
      );

      return result.modifiedCount;
    } catch (error) {
      console.error('Error updating profile picture by ID:', error);
      throw error;
    }
  }
  async deleteCourseImageByID(courseId) {
    try {
        const CourseImageCollection = await this.getConnection();
        console.log('Connection to database established successfully.');

        const result = await CourseImageCollection.deleteOne({ "courseId": courseId });
        console.log('Result of findOneAndDelete:', result);

        if (!result || result.deletedCount === 0) {
            console.log(`No Course Image with ID ${courseId} found.`);
            return 0; // No document found, return 0 to indicate deletion failure
        }
        
        console.log(`Course Image with ID ${courseId} deleted successfully.`);
        return 1; // Document found and deleted, return 1 to indicate successful deletion
    } catch(error) {
        console.error('Error deleting Course Image by ID:', error);
        throw error;
    }
}

  
}

exports.default = CourseImageModel;
