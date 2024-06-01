"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../UserModel/User"));
class Admin extends User_1.default {
    constructor(fName, lName, email, username, pass, mobile, userType, DOB) {
        super(fName, lName, email, username, pass, mobile, userType, DOB);
    }
    signup(fName, lName, email, username, pass, mobile, userType, DOB) {
        throw new Error("Method not implemented.");
    }
    deleteProfile() {
        throw new Error("Method not implemented.");
    }
}
exports.default = Admin;
