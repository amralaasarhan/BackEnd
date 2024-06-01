import { number } from 'joi';
import User from '../UserModel/User'
class Message {
    sender: string;
    recepient: string;
    subject: string;
    body: string;
    messageType: string;
    time: Date;
    userID: number;
    parentMsgID: number | null; // Make parentMsgID nullable
    msgID: number | null

    constructor(
        sender: string,
        recepient: string,
        subject: string,
        body: string,
        messageType: string,
        time: Date,
        userID: number,
        parentMsgID: number | null = null, // Set default value to null
        msgID: number | null = null
    ) {
        this.sender = sender;
        this.recepient = recepient;
        this.subject = subject;
        this.body = body;
        this.time = time;
        this.userID = userID;
        this.messageType = messageType;
        this.parentMsgID = parentMsgID; // Assign parentMsgID
        this.msgID = msgID
    }
}

export default Message;