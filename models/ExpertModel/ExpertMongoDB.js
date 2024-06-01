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
class ExpertMongoDB {
    addExpert(id, specialization) {
        throw new Error("Method not implemented.");
    }
    getExpertByID(id) {
        throw new Error("Method not implemented.");
    }
    deleteExpert(id) {
        throw new Error("Method not implemented.");
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const MongoClient = require("mongodb").MongoClient;
            const uri = "mongodb://127.0.0.1:27017";
            const connect = yield new MongoClient(uri).connect();
            const ProjectDB = connect.db("ProjectDB");
            const SupervisorCollection = yield ProjectDB.collection("Expert");
            return SupervisorCollection;
        });
    }
    getAllExperts() {
        return __awaiter(this, void 0, void 0, function* () {
            const SupervisorCollection = yield this.getConnection();
            const queryResult = yield SupervisorCollection.find().toArray();
            return queryResult;
        });
    }
    updateExpert(supervisorEmail, edit) {
        return __awaiter(this, void 0, void 0, function* () {
            const SupervisorCollection = yield this.getConnection();
            const queryResult = yield SupervisorCollection.find({
                email: supervisorEmail
            }, {
                $set: edit
            });
            return queryResult;
        });
    }
}
exports.default = ExpertMongoDB;
