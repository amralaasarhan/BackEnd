"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../UserModel/User"));
class Student extends User_1.default {
    // private courses : Courses[];
    // private studentPorfolio : Porfolio;
    constructor(fName, lName, email, username, pass, mobile, userType, DOB) {
        super(fName, lName, email, username, pass, mobile, userType, DOB);
        this.track = null;
    }
    signup(fName, lName, email, username, pass, mobile, userType, DOB) {
        console.log("Signed up");
    }
    deleteProfile() {
        console.log("Deleted");
    }
}
exports.default = Student;
