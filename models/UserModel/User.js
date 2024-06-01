"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(fName, lName, email, username, pass, mobile, userType, DOB) {
        this.inbox = [];
        this.sent = [];
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.username = username;
        this.pass = pass;
        this.DOB = DOB;
        this.mobile = mobile;
        this.userType = userType;
    }
    login(username, pass) {
        if (this.username === username && this.pass === pass) {
            return true;
        }
        else
            return false;
    }
    editProfile(fName, lName, email, username, pass, mobile, userType, DOB) {
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.username = username;
        this.pass = pass;
        this.DOB = DOB;
        this.mobile = mobile;
        this.userType = userType;
    }
    sendMessage(msg, user) {
        this.sent.concat(msg);
        user.receiveMessage(msg);
    }
    receiveMessage(msg) {
        this.inbox.concat(msg);
    }
    getInbox() {
        return this.inbox;
    }
    setInbox(inbox) {
        this.inbox = inbox;
    }
}
exports.default = User;
