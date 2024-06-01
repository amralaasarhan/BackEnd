"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class MessageMongoDB {
    getSentMessages(sender) {
        throw new Error("Method not implemented.");
    }
    getReceivedMessage(recepient) {
        throw new Error("Method not implemented.");
    }
    addMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const MessageCollection = yield this.getConnection();
            const queryResult = yield MessageCollection.insertOne(message);
            return queryResult;
        });
    }
    getMessage(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const MessageCollection = yield this.getConnection();
            const queryResult = yield MessageCollection.findOne(filter);
            return queryResult;
        });
    }
    getAllMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            const MessageCollection = yield this.getConnection();
            const queryResult = yield MessageCollection.find().toArray();
            return queryResult;
        });
    }
    getAllMessagesFilter(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const MessageCollection = yield this.getConnection();
            const queryResult = yield MessageCollection.find(filter).toArray();
            return queryResult;
        });
    }
    deleteMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const MessageCollection = yield this.getConnection();
            const queryResult = yield MessageCollection.findOneAndUpdate({
                subject: message.subject
            });
            return queryResult;
        });
    }
    updateMessage(subject, edit) {
        return __awaiter(this, void 0, void 0, function* () {
            const MessageCollection = yield this.getConnection();
            const queryResult = yield MessageCollection.findOneAndUpdate({
                subject: subject
            }, {
                $set: edit
            });
            return queryResult;
        });
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const MongoClient = require("mongodb").MongoClient;
            const uri = "mongodb://127.0.0.1:27017";
            const connect = yield new MongoClient(uri).connect();
            const ProjectDB = connect.db("ProjectDB");
            const MessageCollection = yield ProjectDB.collection("Message");
            return MessageCollection;
        });
    }
}
exports.default = MessageMongoDB;
