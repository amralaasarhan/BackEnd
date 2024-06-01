import Track from "./Track";

interface TrackDAO {
    addTrack(trackTitle:string,trackDescription:string,id:number): Promise<void>;
    getTrackByTitle(title: String): Promise<Track | null> ;
    getTrackById(id: number): Promise<Track | null>;
    getAllTracks(): Promise<Track[]>;
    getAllTracksByPathSupervisorId(pathSupervisorId: number): Promise<Track[]>;
    deleteTrack(title: string): Promise<void>;
    updateTrack(title: string, edit: any): Promise<void>;
}

export default TrackDAO;