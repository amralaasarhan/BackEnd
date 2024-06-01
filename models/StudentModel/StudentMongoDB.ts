import Student from "./Student";
import StudentDAO from "./StudentDAO";

class StudentMongoDB implements StudentDAO {
  deleteStudent(id: number): void {
    throw new Error("Method not implemented.");
  }
  getStudentByID(id: number): Promise<Student | null> {
    throw new Error("Method not implemented.");
  }
 
  async addStudent(id:number): Promise<void> {
    const StudentCollection = await this.getConnection()
    const queryResult = await StudentCollection.insertOne(id)
    return queryResult
  }
  async getStudent(filter: any): Promise<Student> {
    const StudentCollection = await this.getConnection();
    const queryResult = await StudentCollection.findOne(filter);
    return queryResult;
  }
  async getAllStudents(): Promise<Student[]> {
    const StudentCollection = await this.getConnection();
    const queryResult = await StudentCollection.find().toArray();
    return queryResult;
  }

  async updateStudent(studentEmail: string, edit: any): Promise<void> {
    const StudentCollection = await this.getConnection()
    const queryResult = await StudentCollection.findOneAndUpdate({
      email: studentEmail
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
    const StudentCollection = await ProjectDB.collection("Student")
    return StudentCollection
  }
}
export default StudentMongoDB;
