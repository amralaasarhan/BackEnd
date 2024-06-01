"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(sender, recepient, subject, body, messageType, time, userID, parentMsgID = null, // Set default value to null
    msgID = null) {
        this.sender = sender;
        this.recepient = recepient;
        this.subject = subject;
        this.body = body;
        this.time = time;
        this.userID = userID;
        this.messageType = messageType;
        this.parentMsgID = parentMsgID; // Assign parentMsgID
        this.msgID = msgID;
    }
}
exports.default = Message;
