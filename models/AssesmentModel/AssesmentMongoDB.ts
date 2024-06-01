
import Assessment from "./Assesment";
import AssesmentDAO from "./AssesmentDAO";
import { MongoClient, GridFSBucket } from 'mongodb';


class AssesmentMongoDB implements AssesmentDAO {
    addAssesmentQuestion(assesmentId: number, question: string, questionType: string, questionLevel: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addAssesmentQuestionAndCourseTopic(assesmentQuestionId: number, courseTopicId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addAssesment(assesmentType: string, courseIloId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
 
    addAnswer(assesmentQuestionId: number, answerText: string, correctAnswer: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteAssesment(assesmentId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteAssesmentQuestion(assesmentQuestionId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteAnswer(answerId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getAssessments(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    getAssessmentByCourseIloId(courseIloId: number): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    getAssessmentQuestions(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    getAssessmentQuestionsByAssessmentId(assessmentId: number): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    getAnswerByAssessmentQuestionId(assesmentQuestionId: number): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
   

    async uploadAssessmentFile(filename: string, fileData: Buffer): Promise<string> {
        const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
        const db = client.db("ProjectDB");
        const bucket = new GridFSBucket(db, { bucketName: 'Assessment' });

        const uploadStream = bucket.openUploadStream(filename);
        uploadStream.end(fileData);

        return new Promise<string>((resolve, reject) => {
            uploadStream.on('error', reject);
            uploadStream.on('finish', () => resolve(uploadStream.id.toHexString()));
        });
    }
    
    async getConnection() {
        const MongoClient = require("mongodb").MongoClient
        const uri = "mongodb://127.0.0.1:27017"
        const connect = await new MongoClient(uri).connect()
        const ProjectDB = connect.db("ProjectDB")
        const AssessmentCollection = await ProjectDB.collection("Assessment")
        return AssessmentCollection
    }
}

export default AssesmentMongoDB;