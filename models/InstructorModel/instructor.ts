import Course from "../CourseModel/Course";
import Track from "../TrackModel/Track";
import User from "../UserModel/User";

class Instructor extends User { 
    course : Course | null
    track : Track | null
    
    

 constructor(fName: string, lName: string, email: string, username: string, pass: string, mobile: string, userType: string, DOB: Date)
    {
        super(fName,lName,email,username,pass,mobile,userType,DOB);
        this.course= null
        this. track = null

    }
  
    signup(fName: string, lName: string, email: string, username: string, pass: string, mobile: string, userType: string, DOB: Date): void {
        console.log("Signed up");
    }
    deleteProfile(): void {
        console.log("Deleted");
    }


}
export default Instructor
