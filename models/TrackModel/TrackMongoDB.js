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
class TrackMongoDB {
    addTrack(trackTitle, trackDescription, id) {
        throw new Error("Method not implemented.");
    }
    getTrackByTitle(title) {
        throw new Error("Method not implemented.");
    }
    getTrackById(id) {
        throw new Error("Method not implemented.");
    }
    getAllTracksByPathSupervisorId(pathSupervisorId) {
        throw new Error("Method not implemented.");
    }
    deleteTrack(title) {
        throw new Error("Method not implemented.");
    }
    getTrack(title) {
        throw new Error("Method not implemented.");
    }
    getAllTracks() {
        return __awaiter(this, void 0, void 0, function* () {
            const TrackCollection = yield this.getConnection();
            const queryResult = yield TrackCollection.find().toArray();
            return queryResult;
        });
    }
    updateTrack(title, edit) {
        return __awaiter(this, void 0, void 0, function* () {
            const TrackCollection = yield this.getConnection();
            const queryResult = yield TrackCollection.findOneAndUpdate({
                title: title
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
            const TrackCollection = yield ProjectDB.collection("Track");
            return TrackCollection;
        });
    }
}
exports.default = TrackMongoDB;
