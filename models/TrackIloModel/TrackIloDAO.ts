interface TrackIloDAO {
  addTrackIlo(trackOutcome: string, trackType: string, trackId: number, trackDescription: string): Promise<void>;
  deleteTrackIlo(trackId: number): Promise<void>;
  updateTrackIlo(filter: any, updateData: any): Promise<void>;
  
}
export default TrackIloDAO;
