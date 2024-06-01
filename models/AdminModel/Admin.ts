import User from "../UserModel/User";

class Admin extends User{

    constructor(fName: string, lName: string, email: string, username: string, pass: string, mobile: string, userType: string, DOB: Date) {
        super(fName, lName, email, username, pass, mobile, userType, DOB);
    }

    signup(fName: string, lName: string, email: string, username: string, pass: string, mobile: string, userType: string, DOB: Date): void {
        throw new Error("Method not implemented.");
    }
    deleteProfile(): void {
        throw new Error("Method not implemented.");
    }
    
}

export default Admin;