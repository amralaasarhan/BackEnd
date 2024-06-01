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
class InstructorMongoDB {
    getInstructorByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const InstructorCollection = yield this.getConnection();
            const queryResult = yield InstructorCollection.findOne(id);
            return queryResult;
        });
    }
    deleteInstructor(id) {
        throw new Error("Method not implemented.");
    }
    assignCourse(id, course) {
        throw new Error("Method not implemented.");
    }
    addInstructor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const InstructorCollection = yield this.getConnection();
            const queryResult = yield InstructorCollection.insertOne(id);
            return queryResult;
        });
    }
    getInstructor(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const InstructorCollection = yield this.getConnection();
            const queryResult = yield InstructorCollection.findOne(filter);
            return queryResult;
        });
    }
    getAllInstructors() {
        return __awaiter(this, void 0, void 0, function* () {
            const InstructorCollection = yield this.getConnection();
            const queryResult = yield InstructorCollection.find().toArray();
            return queryResult;
        });
    }
    updateInstructor(InstructorEmail, edit) {
        return __awaiter(this, void 0, void 0, function* () {
            const InstructorCollection = yield this.getConnection();
            const queryResult = yield InstructorCollection.findOneAndUpdate({
                email: InstructorEmail
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
            const InstructorCollection = yield ProjectDB.collection("Instructor");
            return InstructorCollection;
        });
    }
}
