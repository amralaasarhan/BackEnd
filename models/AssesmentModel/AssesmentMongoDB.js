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
const mongodb_1 = require("mongodb");
class AssesmentMongoDB {
    addAssesmentQuestion(assesmentId, question, questionType, questionLevel) {
        throw new Error("Method not implemented.");
    }
    addAssesmentQuestionAndCourseTopic(assesmentQuestionId, courseTopicId) {
        throw new Error("Method not implemented.");
    }
    addAssesment(assesmentType, courseIloId) {
        throw new Error("Method not implemented.");
    }
    addAnswer(assesmentQuestionId, answerText, correctAnswer) {
        throw new Error("Method not implemented.");
    }
    deleteAssesment(assesmentId) {
        throw new Error("Method not implemented.");
    }
    deleteAssesmentQuestion(assesmentQuestionId) {
        throw new Error("Method not implemented.");
    }
    deleteAnswer(answerId) {
        throw new Error("Method not implemented.");
    }
    getAssessments() {
        throw new Error("Method not implemented.");
    }
    getAssessmentByCourseIloId(courseIloId) {
        throw new Error("Method not implemented.");
    }
    getAssessmentQuestions() {
        throw new Error("Method not implemented.");
    }
    getAssessmentQuestionsByAssessmentId(assessmentId) {
        throw new Error("Method not implemented.");
    }
    getAnswerByAssessmentQuestionId(assesmentQuestionId) {
        throw new Error("Method not implemented.");
    }
    uploadAssessmentFile(filename, fileData) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield mongodb_1.MongoClient.connect("mongodb://127.0.0.1:27017");
            const db = client.db("ProjectDB");
            const bucket = new mongodb_1.GridFSBucket(db, { bucketName: 'Assessment' });
            const uploadStream = bucket.openUploadStream(filename);
            uploadStream.end(fileData);
            return new Promise((resolve, reject) => {
                uploadStream.on('error', reject);
                uploadStream.on('finish', () => resolve(uploadStream.id.toHexString()));
            });
        });
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const MongoClient = require("mongodb").MongoClient;
            const uri = "mongodb://127.0.0.1:27017";
            const connect = yield new MongoClient(uri).connect();
            const ProjectDB = connect.db("ProjectDB");
            const AssessmentCollection = yield ProjectDB.collection("Assessment");
            return AssessmentCollection;
        });
    }
}
exports.default = AssesmentMongoDB;
