import User from "../UserModel/User";
import Track from "../TrackModel/Track";


class Student extends User {
    track: Track | null;
    // private courses : Courses[];
    // private studentPorfolio : Porfolio;
    constructor(fName: string, lName: string, email: string, username: string, pass: string, mobile: string, userType: string, DOB: Date) {
        super(fName, lName, email, username, pass, mobile, userType, DOB);
        this.track = null;

    }

    signup(fName: string, lName: string, email: string, username: string, pass: string, mobile: string, userType: string, DOB: Date): void {
        console.log("Signed up");
    }
    deleteProfile(): void {
        console.log("Deleted");
    }


}
export default Student