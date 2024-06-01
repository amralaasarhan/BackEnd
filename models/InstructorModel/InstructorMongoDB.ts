import Course from "../CourseModel/Course";
import InstructorDAO from "./InstructorDAO";
import Instructor from "./instructor";

class InstructorMongoDB implements InstructorDAO   {
    async getInstructorByID(id: number): Promise<Instructor | null> {
        const InstructorCollection = await this.getConnection();
        const queryResult = await InstructorCollection.findOne(id);
        return queryResult;
    }
    deleteInstructor(id: number): void {
        throw new Error("Method not implemented.");
    }
    assignCourse(id: number, course: Course): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async addInstructor(id:number): Promise<void> {
        const InstructorCollection = await this.getConnection()
        const queryResult = await InstructorCollection.insertOne(id)
        return queryResult
      }
      async getInstructor(filter: any): Promise<Instructor> {
        const InstructorCollection = await this.getConnection();
        const queryResult = await InstructorCollection.findOne(filter);
        return queryResult;
      }
      async getAllInstructors(): Promise<Instructor[]> {
        const InstructorCollection = await this.getConnection();
        const queryResult = await InstructorCollection.find().toArray();
        return queryResult;
      }
    
      async updateInstructor(InstructorEmail: string, edit: any): Promise<void> {
        const InstructorCollection = await this.getConnection()
        const queryResult = await InstructorCollection.findOneAndUpdate({
          email: InstructorEmail
        },
          {
            $set: edit
          })
        return queryResult
      }
    
    
       async getConnection() {
        const MongoClient = require("mongodb").MongoClient
        const uri = "mongodb://127.0.0.1:27017"
        const connect = await new MongoClient(uri).connect()
        const ProjectDB = connect.db("ProjectDB")
        const InstructorCollection = await ProjectDB.collection("Instructor")
        return InstructorCollection
      }
}