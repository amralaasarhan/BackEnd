import Supervisor from "./Supervisor";
import SupervisorDAO from "./SupervisorDAO";

class SupervisorMongoDB implements SupervisorDAO {
  getSupervisorByID(id: number): Promise<Supervisor | null> {
    throw new Error("Method not implemented.");
  }
 
  deleteSupervisor(id: number): void {
    throw new Error("Method not implemented.");
  }
  
  async getConnection() {
    const MongoClient = require("mongodb").MongoClient
    const uri = "mongodb://127.0.0.1:27017"
    const connect = await new MongoClient(uri).connect()
    const ProjectDB = connect.db("ProjectDB")
    const SupervisorCollection = await ProjectDB.collection("PathSupervisor")
    return SupervisorCollection
  }

  async addSupervisor(id:number): Promise<void> {
    const SupervisorCollection = await this.getConnection()
    const queryResult = await SupervisorCollection.insertOne(id)
    return queryResult
  }
  async getSupervisor(filter: any): Promise<Supervisor> {
    const SupervisorCollection = await this.getConnection();
    const queryResult = await SupervisorCollection.findOne(filter);
    return queryResult;
  }
  async getAllSupervisors(): Promise<Supervisor[]> {
    const SupervisorCollection = await this.getConnection();
    const queryResult = await SupervisorCollection.find().toArray();
    return queryResult;
  }

 
  async updateSupervisor(supervisorEmail: string, edit: any): Promise<void> {
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
export default SupervisorMongoDB;
