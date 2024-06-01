import Track from "./Track";
import TrackDAO from "./TrackDAO"

class TrackMongoDB implements TrackDAO {
  addTrack(trackTitle: string, trackDescription: string, id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getTrackByTitle(title: String): Promise<Track | null> {
    throw new Error("Method not implemented.");
  }
  getTrackById(id: number): Promise<Track | null> {
    throw new Error("Method not implemented.");
  }
  getAllTracksByPathSupervisorId(pathSupervisorId: number): Promise<Track[]> {
    throw new Error("Method not implemented.");
  }

  deleteTrack(title: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getTrack(title: String): Promise<Track | null> {
    throw new Error("Method not implemented.");
  }

 
  async getAllTracks(): Promise<Track[]> {
    const TrackCollection = await this.getConnection();
    const queryResult = await TrackCollection.find().toArray();
    return queryResult;
  }

 
  async updateTrack(title: string, edit: any): Promise<void> {
    const TrackCollection = await this.getConnection()
    const queryResult = await TrackCollection.findOneAndUpdate({
      title: title
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
    const TrackCollection = await ProjectDB.collection("Track")
    return TrackCollection
  }
}
export default TrackMongoDB;
