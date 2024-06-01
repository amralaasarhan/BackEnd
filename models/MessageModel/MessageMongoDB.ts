import Message from "./Message";
import MessageDAO from "./MessageDAO"

class MessageMongoDB implements MessageDAO {
    getSentMessages(sender: string): Promise<Message[]> {
        throw new Error("Method not implemented.");
    }
    getReceivedMessage(recepient: string): Promise<Message[]> {
        throw new Error("Method not implemented.");
    }
    async addMessage(message: Message): Promise<void> {
        const MessageCollection = await this.getConnection()
        const queryResult = await MessageCollection.insertOne(message)
        return queryResult
    }
    async getMessage(filter: any): Promise<Message> {
        const MessageCollection = await this.getConnection();
        const queryResult = await MessageCollection.findOne(filter);
        return queryResult;
    }
    async getAllMessages(): Promise<Message[]> {
        const MessageCollection = await this.getConnection();
        const queryResult = await MessageCollection.find().toArray();
        return queryResult;
    }

    async getAllMessagesFilter(filter: any): Promise<Message[]> {
        const MessageCollection = await this.getConnection();
        const queryResult = await MessageCollection.find(filter).toArray();
        return queryResult;
    }

    async deleteMessage(message: Message): Promise<void> {
        const MessageCollection = await this.getConnection()
        const queryResult = await MessageCollection.findOneAndUpdate({
            subject: message.subject
        })
        return queryResult;
    }
    async updateMessage(subject: string, edit: any): Promise<void> {
        const MessageCollection = await this.getConnection()
        const queryResult = await MessageCollection.findOneAndUpdate({
            subject: subject
        },
            {
                $set: edit
            })
        return queryResult
    }


    async getConnection() {
        const MongoClient = require("mongodb").MongoClient
        const uri = "mongodb://127.0.0.1:27017"
        const connect = await new MongoClient(uri).connect()
        const ProjectDB = connect.db("ProjectDB")
        const MessageCollection = await ProjectDB.collection("Message")
        return MessageCollection
    }
}
export default MessageMongoDB;
