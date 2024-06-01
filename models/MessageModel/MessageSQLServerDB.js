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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = __importDefault(require("./Message"));
const sql = require("msnodesqlv8");
const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";
class MessageSQLServerDB {
    getMessage(filter) {
        throw new Error("Method not implemented.");
    }
    addMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertQuery = "INSERT INTO MESSAGE (RECEPIENT, SENDER, MESSAGE_TYPE, TIME, SUBJECT , BODY , USER_ID_FK) VALUES (?, ?, ?,?,?,?,?)";
            const insertValues = [message.recepient, message.sender, message.messageType, message.time, message.subject, message.body, message.userID];
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, insertQuery, insertValues, (err, results) => {
                        if (err) {
                            console.error('Error inserting record:', err);
                            reject(err);
                        }
                        else {
                            console.log('Query Results:', results);
                            resolve(results);
                        }
                    });
                });
            }
            catch (error) {
                console.error('Error inserting record:', error);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getSentMessages(sender) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectQuery = 'SELECT * FROM MESSAGE WHERE SENDER = ?';
            const messageToCheck = sender;
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, [messageToCheck], (err, results) => {
                        if (err) {
                            console.error("Error in database query:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                const messages = [];
                console.log(results.rows);
                if (results && results.rows && results.rows.length > 0) {
                    results.rows.forEach((row) => {
                        // Assuming the data structure returned by the database is { SENDER, RECIPIENT, SUBJECT, BODY, MESSAGE_TYPE, TIME, USER_ID_FK }
                        const message = new Message_1.default(row[2], // sender
                        row[1], // recipient
                        row[5], // subject
                        row[6], // body
                        row[3], // message_type
                        new Date(row[4]), // time
                        row[7], // user_id_fk
                        row[8], // parentMsgID
                        row[0]);
                        messages.push(message);
                    });
                    console.log('Messages found:', messages);
                }
                else {
                    console.error("No messages found.");
                }
                return messages;
            }
            catch (error) {
                console.error("Error getting messages:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    getReceivedMessage(recepient) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectQuery = 'SELECT * FROM MESSAGE WHERE RECEPIENT  = ?';
            const messageToCheck = recepient;
            try {
                const results = yield new Promise((resolve, reject) => {
                    sql.queryRaw(connectionString, selectQuery, [messageToCheck], (err, results) => {
                        if (err) {
                            console.error("Error in database query:", err);
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    });
                });
                const messages = [];
                if (results && results.rows && results.rows.length > 0) {
                    results.rows.forEach((row) => {
                        const message = new Message_1.default(row[2], // sender
                        row[1], // recipient
                        row[5], // subject
                        row[6], // body
                        row[3], // message_type
                        new Date(row[4]), // time
                        row[7], // user_id_fk
                        row[8], // parentMsgID
                        row[0]);
                        messages.push(message);
                    });
                    console.log('Messages found:', messages);
                }
                else {
                }
                return messages;
            }
            catch (error) {
                console.error("Error getting courses:", error.message);
                throw error;
            }
            finally {
                if (sql && sql.close) {
                    yield sql.close();
                }
            }
        });
    }
    deleteMessage(message) {
        throw new Error("Method not implemented.");
    }
    updateMessage(subject, edit) {
        throw new Error("Method not implemented.");
    }
}
exports.default = MessageSQLServerDB;
