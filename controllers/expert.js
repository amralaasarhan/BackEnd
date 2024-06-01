const { default: Expert } = require("../models/ExpertModel/Expert");
const { default: ExpertSQLServerDB } = require("../models/ExpertModel/ExpertSQLServerDB");
const expertSQLServerDB = new ExpertSQLServerDB();


const { default: UsertSQLServerDB } = require("../models/UserModel/UserSQLServerDB");
const userSQLServerDB = new UsertSQLServerDB();


const { default: Message } = require("../models/MessageModel/Message")
const { default: MessageMongoDB } = require("../models/MessageModel/MessageMongoDB")
const { default: MessageSQLServerDB } = require("../models/MessageModel/MessageSQLServerDB");
const messageSQLServerDB = new MessageSQLServerDB();

exports.getAllExpertsNames = async (req, res) => {
    try {
        const names = await expertSQLServerDB.getAllExpertsNames();

        // Handle the response as needed
        return res.json(names);
    } catch (error) {
        console.error('Error in getTrackByName controller:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }


}

exports.sendMessage = async (req, res) => {

    try {
        console.log("Send Method entered", req.body.email)

        const senderEmail = req.body.email;
        const sender = await userSQLServerDB.getUserByEmail(senderEmail);
        const recepientUsername = req.body.to;
        const recepient = await userSQLServerDB.getUserByUsername(recepientUsername);
        if (!recepient) {
            return response.status(404).json({
                status: "Error",
                message: "wrong recepient"
            })
        }
        const msgBody = req.body.msgBody;
        const msgSubject = req.body.msgTitle;
        const msgType = req.body.msgType;
        const senderID = sender[0];
        const time = new Date();
        const msg = new Message(sender[3], recepient[3], msgSubject, msgBody, msgType, time, senderID)
        const queryResult = await messageSQLServerDB.addMessage(msg);
        return res.status(200).json({ message: "Message Sent!", status: "OK" })
    } catch (error) {
        console.error('Error in getTrackByName controller:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}