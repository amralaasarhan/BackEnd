class TrackIlo {
    trackId: number;
    trackIloId:number
    trackOutcome: string;
    trackType: string;
    trackDescription: string;

    constructor( trackIloId: number,trackOutcome: string, trackType: string, trackId: number, trackDescription: string) {
        this.trackIloId = trackIloId;
        this.trackOutcome = trackOutcome;
        this.trackType = trackType;
        this.trackId = trackId;
        this.trackDescription = trackDescription;
    }
}

export default TrackIlo