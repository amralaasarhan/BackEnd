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
class StudentMongoDB {
    deleteStudent(id) {
        throw new Error("Method not implemented.");
    }
    getStudentByID(id) {
        throw new Error("Method not implemented.");
    }
    addStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const StudentCollection = yield this.getConnection();
            const queryResult = yield StudentCollection.insertOne(id);
            return queryResult;
        });
    }
    getStudent(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const StudentCollection = yield this.getConnection();
            const queryResult = yield StudentCollection.findOne(filter);
            return queryResult;
        });
    }
    getAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            const StudentCollection = yield this.getConnection();
            const queryResult = yield StudentCollection.find().toArray();
            return queryResult;
        });
    }
    updateStudent(studentEmail, edit) {
        return __awaiter(this, void 0, void 0, function* () {
            const StudentCollection = yield this.getConnection();
            const queryResult = yield StudentCollection.findOneAndUpdate({
                email: studentEmail
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
            const StudentCollection = yield ProjectDB.collection("Student");
            return StudentCollection;
        });
    }
}
exports.default = StudentMongoDB;
