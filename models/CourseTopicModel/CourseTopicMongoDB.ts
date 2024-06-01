import CourseTopic from "./CourseTopic";
import CourseTopicDAO from "./CourseTopicDAO";
import { MongoClient, ObjectId } from "mongodb";

class CourseTopicMongoDB implements CourseTopicDAO {
  addCourseTopic(topicName: string, courseId: number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  deleteCourseTopic(courseId: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  
  async addCourseTopicToMongo(courseTopicId: number, files: any[]): Promise<void> {
    try {
      const courseCollection = await this.getConnection();
      const result = await courseCollection.insertOne({
        courseTopicId: courseTopicId,
        files:files
      });

    } catch (error) {
      console.error("Error adding course topic: in mongo", error);
    }
  }

  async getCourseTopicFromMongo(courseTopicId:number): Promise<void>  {
    try{ const courseCollection = await this.getConnection()
    const result = await courseCollection.findOne({
      "courseTopicId": courseTopicId,
    });

    return result;

  } catch(error) {
    console.error('Error getting Track Image by ID:', error);
    throw error;
  }}

  async deleteCourseTopicInMongo(courseTopicId: number): Promise<void> {
    try {
      const courseCollection = await this.getConnection();
      const result = await courseCollection.deleteOne({ "courseTopicId": courseTopicId });
      console.log('Result of findOneAndDelete:', result);
      if (!result || result.deletedCount === 0) {
        console.log(`No Track Image with ID ${courseTopicId} found.`);
    }
    
    console.log(`Track Image with ID ${courseTopicId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting course topic from MongoDB:", error);
      throw new Error("Failed to delete course topic from MongoDB.");
    }
  }

  async editCourseTopicInMongo(courseTopicId: number, files: any[]): Promise<void> {
    try {
      const courseCollection = await this.getConnection();
      await courseCollection.updateOne(
        { "courseTopicId": courseTopicId},
        { $set: { "files": files } }
      );
    } catch (error) {
      console.error("Error updating course topic in MongoDB:", error);
      throw new Error("Failed to update course topic in MongoDB.");
    }
  }

  async getConnection() {
    try {
      const MongoClient = require("mongodb").MongoClient;
      const uri = "mongodb://127.0.0.1:27017";
      const connect = await new MongoClient(uri).connect();
      const ProjectDB = connect.db("ProjectDB");
      const CourseCollection = await ProjectDB.collection("Course Topics");
      return CourseCollection;
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw new Error("Failed to connect to MongoDB.");
    }
  }
}

export default CourseTopicMongoDB;
