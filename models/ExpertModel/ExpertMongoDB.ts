import Expert from "./Expert";
import ExpertDAO from "./ExpertDAO";

class ExpertMongoDB implements ExpertDAO {
  addExpert(id: number, specialization: String): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getExpertByID(id: number): Promise<Expert | null> {
    throw new Error("Method not implemented.");
  }
 
  deleteExpert(id: number): void {
    throw new Error("Method not implemented.");
  }
  
  async getConnection() {
    const MongoClient = require("mongodb").MongoClient
    const uri = "mongodb://127.0.0.1:27017"
    const connect = await new MongoClient(uri).connect()
    const ProjectDB = connect.db("ProjectDB")
    const SupervisorCollection = await ProjectDB.collection("Expert")
    return SupervisorCollection
  }

  
  
  async getAllExperts(): Promise<Expert[]> {
    const SupervisorCollection = await this.getConnection();
    const queryResult = await SupervisorCollection.find().toArray();
    return queryResult;
  }

 
  async updateExpert(supervisorEmail: string, edit: any): Promise<void> {
    const SupervisorCollection = await this.getConnection()
    const queryResult = await SupervisorCollection.find({
      email: supervisorEmail
    },
      {
        $set: edit
      })
    return queryResult
  }

}
export default ExpertMongoDB;
