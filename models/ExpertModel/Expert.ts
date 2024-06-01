import User from "../UserModel/User";


class Expert extends User {
    verifed: boolean ;
    specialization: String;

    constructor(fName: string, lName: string, email: string, username: string, pass: string, mobile: string, userType: string, DOB: Date,specialization: String ) {
        super(fName, lName, email, username, pass, mobile, userType, DOB);
        this.specialization = specialization;
        this.verifed =false;
    }

    signup(fName: string, lName: string, email: string, username: string, pass: string, mobile: string, userType: string, DOB: Date): void {
        throw new Error("Method not implemented.");
    }
    deleteProfile(): void {
        throw new Error("Method not implemented.");
    }

}

export default Expert;



