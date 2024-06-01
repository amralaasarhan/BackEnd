"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../UserModel/User"));
class Instructor extends User_1.default {
    constructor(fName, lName, email, username, pass, mobile, userType, DOB) {
        super(fName, lName, email, username, pass, mobile, userType, DOB);
        this.course = null;
        this.track = null;
    }
    signup(fName, lName, email, username, pass, mobile, userType, DOB) {
        console.log("Signed up");
    }
    deleteProfile() {
        console.log("Deleted");
    }
}
exports.default = Instructor;
