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
const mongodb_2 = require("mongodb");
class assessmentMongo {
    constructor() {
        this.db = null;
        this.collectionName = 'assessmentFiles'; // Adjust collection name as needed
        this.uri = 'mongodb://127.0.0.1:27017/ProjectDB'; // Adjust MongoDB URI as needed
    }
    addAssessment(assessmentFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.db) {
                    yield this.connectToDatabase();
                }
                if (!this.db) {
                    throw new Error('Database connection is not established.');
                }
                const submissionsCollection = this.db.collection(this.collectionName);
                const result = yield submissionsCollection.insertOne(assessmentFile);
                return result;
            }
            catch (error) {
                console.error('Error adding submission:', error);
                throw error;
            }
        });
    }
    addAssessmentSubmission(assessmentFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.db) {
                    yield this.connectToDatabase();
                }
                if (!this.db) {
                    throw new Error('Database connection is not established.');
                }
                const submissionsCollection = this.db.collection('AssessmentSubmissions');
                const result = yield submissionsCollection.insertOne(assessmentFile);
                return result;
            }
            catch (error) {
                console.error('Error adding submission:', error);
                throw error;
            }
        });
    }
    getAssessments(courseID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.db) {
                    yield this.connectToDatabase();
                }
                if (!this.db) {
                    throw new Error('Database connection is not established.');
                }
                const assessmentFiles = this.db.collection(this.collectionName);
                const result = yield assessmentFiles.find({ courseID: courseID }).toArray();
                return result;
            }
            catch (error) {
                console.error('Error retrieving assessments:', error);
                throw error;
            }
        });
    }
    getAssessment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.db) {
                    yield this.connectToDatabase();
                }
                if (!this.db) {
                    throw new Error('Database connection is not established.');
                }
                const assessmentFiles = this.db.collection(this.collectionName);
                const result = yield assessmentFiles.findOne({ assessmentID: id });
                return result;
            }
            catch (error) {
                console.error('Error retrieving assessments:', error);
                throw error;
            }
        });
    }
    updateSubmission(submissionId, updatedSubmission) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ensure database connection
                if (!this.db) {
                    yield this.connectToDatabase();
                }
                // Check if database connection is established
                if (!this.db) {
                    throw new Error('Database connection is not established.');
                }
                // Access the submissions collection
                const submissionsCollection = this.db.collection(this.collectionName);
                // Convert submissionId to ObjectId
                const objectIdSubmissionId = new mongodb_2.ObjectId(submissionId);
                // Update the submission in the database
                const filter = { _id: objectIdSubmissionId };
                const updateDocument = { $set: updatedSubmission };
                const updateResult = yield submissionsCollection.updateOne(filter, updateDocument);
                // Return the update result
                return updateResult;
            }
            catch (error) {
                console.error('Error updating submission:', error);
                throw error;
            }
        });
    }
    deleteAssessmentFile(assessmentID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ensure database connection
                if (!this.db) {
                    yield this.connectToDatabase();
                }
                // Check if database connection is established
                if (!this.db) {
                    throw new Error('Database connection is not established.');
                }
                // Access the submissions collection
                const submissionsCollection = this.db.collection(this.collectionName);
                // Convert submissionId to ObjectId
                const filter = { assessmentID: assessmentID };
                const deleteResult = yield submissionsCollection.deleteOne(filter);
                // Return the delete result
                return deleteResult;
            }
            catch (error) {
                console.error('Error deleting submission:', error);
                throw error;
            }
        });
    }
    getAssessmentFileByAssessmentID(assessmentID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.db) {
                    yield this.connectToDatabase();
                }
                if (!this.db) {
                    throw new Error('Database connection is not established.');
                }
                const AssessmentCollection = this.db.collection(this.collectionName);
                // Ensure the query correctly references the nested fields
                const result = yield AssessmentCollection.findOne({ assessmentID: assessmentID });
                if (!result) {
                    throw new Error('File not found.');
                }
                // Ensure the fields are correctly extracted from the result
                const file = result.file; // Assuming 'file' is a Buffer or similar binary data type
                return file;
            }
            catch (error) {
                console.error('Error getting topic file:', error);
                throw error;
            }
        });
    }
    getMongoIDSubmissionID(submissionID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.db) {
                    yield this.connectToDatabase();
                }
                if (!this.db) {
                    throw new Error('Database connection is not established.');
                }
                const SubmissionFile = this.db.collection(this.collectionName);
                // Ensure the query correctly references the nested fields
                const result = yield SubmissionFile.findOne({ submissionID: submissionID });
                if (!result) {
                    throw new Error('File not found.');
                }
                // Ensure the fields are correctly extracted from the result
                const id = result._id; // Assuming 'file' is a Buffer or similar binary data type
                return id;
            }
            catch (error) {
                console.error('Error getting mongo id  :', error);
                throw error;
            }
        });
    }
    connectToDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new mongodb_1.MongoClient(this.uri);
            try {
                yield client.connect();
                this.db = client.db();
                console.log('Connected to MongoDB');
            }
            catch (error) {
                console.error('Error connecting to MongoDB:', error);
                throw error;
            }
        });
    }
}
exports.default = assessmentMongo;
