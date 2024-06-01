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
class CourseTopicMongoDB {
    addCourseTopic(topicName, courseId) {
        throw new Error("Method not implemented.");
    }
    deleteCourseTopic(courseId) {
        throw new Error("Method not implemented.");
    }
    addCourseTopicToMongo(courseTopicId, files) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseCollection = yield this.getConnection();
                const result = yield courseCollection.insertOne({
                    courseTopicId: courseTopicId,
                    files: files
                });
            }
            catch (error) {
                console.error("Error adding course topic: in mongo", error);
            }
        });
    }
    getCourseTopicFromMongo(courseTopicId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseCollection = yield this.getConnection();
                const result = yield courseCollection.findOne({
                    "courseTopicId": courseTopicId,
                });
                return result;
            }
            catch (error) {
                console.error('Error getting Track Image by ID:', error);
                throw error;
            }
        });
    }
    deleteCourseTopicInMongo(courseTopicId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseCollection = yield this.getConnection();
                const result = yield courseCollection.deleteOne({ "courseTopicId": courseTopicId });
                console.log('Result of findOneAndDelete:', result);
                if (!result || result.deletedCount === 0) {
                    console.log(`No Track Image with ID ${courseTopicId} found.`);
                }
                console.log(`Track Image with ID ${courseTopicId} deleted successfully.`);
            }
            catch (error) {
                console.error("Error deleting course topic from MongoDB:", error);
                throw new Error("Failed to delete course topic from MongoDB.");
            }
        });
    }
    editCourseTopicInMongo(courseTopicId, files) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseCollection = yield this.getConnection();
                yield courseCollection.updateOne({ "courseTopicId": courseTopicId }, { $set: { "files": files } });
            }
            catch (error) {
                console.error("Error updating course topic in MongoDB:", error);
                throw new Error("Failed to update course topic in MongoDB.");
            }
        });
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const MongoClient = require("mongodb").MongoClient;
                const uri = "mongodb://127.0.0.1:27017";
                const connect = yield new MongoClient(uri).connect();
                const ProjectDB = connect.db("ProjectDB");
                const CourseCollection = yield ProjectDB.collection("Course Topics");
                return CourseCollection;
            }
            catch (error) {
                console.error("Error connecting to MongoDB:", error);
                throw new Error("Failed to connect to MongoDB.");
            }
        });
    }
}
exports.default = CourseTopicMongoDB;
