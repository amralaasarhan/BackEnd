import User from "../UserModel/User";
import Track from "../TrackModel/Track";
///import Course from "../CourseModel/Course";
//import CourseTopic from "../CourseTopicModel/CourseTopic";

class Supervisor extends User {
    managedTracks: Track[];

    constructor(fName: string, lName: string, email: string, username: string, pass: string, mobile: string, userType: string, DOB: Date) {
        super(fName, lName, email, username, pass, mobile, userType, DOB);
        this.managedTracks = [];
    }

    signup(fName: string, lName: string, email: string, username: string, pass: string, mobile: string, userType: string, DOB: Date): void {
    }

    deleteProfile(): void {
    }

}

export default Supervisor;



