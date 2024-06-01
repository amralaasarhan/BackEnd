"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../UserModel/User"));
///import Course from "../CourseModel/Course";
//import CourseTopic from "../CourseTopicModel/CourseTopic";
class Supervisor extends User_1.default {
    constructor(fName, lName, email, username, pass, mobile, userType, DOB) {
        super(fName, lName, email, username, pass, mobile, userType, DOB);
        this.managedTracks = [];
    }
    signup(fName, lName, email, username, pass, mobile, userType, DOB) {
    }
    deleteProfile() {
    }
}
exports.default = Supervisor;
