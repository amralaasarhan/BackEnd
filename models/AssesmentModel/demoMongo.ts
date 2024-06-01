import { MongoClient, Db, Collection, InsertOneResult, Document, UpdateResult, DeleteResult } from 'mongodb';
import { ObjectId } from 'mongodb';
import AssesmentMongoDB from './AssesmentMongoDB';


class assessmentMongo  {
    private db: Db | null;
    private collectionName: string;
    private uri: string;

    constructor() {
        this.db = null;
        this.collectionName = 'assessmentFiles'; // Adjust collection name as needed
        this.uri = 'mongodb://127.0.0.1:27017/ProjectDB'; // Adjust MongoDB URI as needed
    }

    async addAssessment(assessmentFile: any): Promise<InsertOneResult<Document>> {
        try {
            if (!this.db) {
                await this.connectToDatabase();
            }

            if (!this.db) {
                throw new Error('Database connection is not established.');
            }

            const submissionsCollection: Collection = this.db.collection(this.collectionName);
            const result: InsertOneResult = await submissionsCollection.insertOne(assessmentFile);

            return result;
        } catch (error) {
            console.error('Error adding submission:', error);
            throw error;
        }
    }
    async addAssessmentSubmission(assessmentFile: any): Promise<InsertOneResult<Document>> {
        try {
            if (!this.db) {
                await this.connectToDatabase();
            }

            if (!this.db) {
                throw new Error('Database connection is not established.');
            }

            const submissionsCollection: Collection = this.db.collection('AssessmentSubmissions');
            const result: InsertOneResult = await submissionsCollection.insertOne(assessmentFile);

            return result;
        } catch (error) {
            console.error('Error adding submission:', error);
            throw error;
        }
    }
    async getAssessments(courseID: number ): Promise<any> {
        try {
          if (!this.db) {
            await this.connectToDatabase();
          }
      
          if (!this.db) {
            throw new Error('Database connection is not established.');
          }
      
          const assessmentFiles: Collection = this.db.collection(this.collectionName);
          const result = await assessmentFiles.find({courseID: courseID}).toArray();
      
          return result;
        } catch (error) {
          console.error('Error retrieving assessments:', error);
          throw error;
        }
      }
      
      async getAssessment(id:number ): Promise<any> {
        try {
          if (!this.db) {
            await this.connectToDatabase();
          }
      
          if (!this.db) {
            throw new Error('Database connection is not established.');
          }
      
          const assessmentFiles: Collection = this.db.collection(this.collectionName);
          const result = await assessmentFiles.findOne({assessmentID:id})
      
          return result;
        } catch (error) {
          console.error('Error retrieving assessments:', error);
          throw error;
        }
      }
async updateSubmission(submissionId: string, updatedSubmission: any): Promise<UpdateResult> {
    try {
        // Ensure database connection
        if (!this.db) {
            await this.connectToDatabase();
        }

        // Check if database connection is established
        if (!this.db) {
            throw new Error('Database connection is not established.');
        }

        // Access the submissions collection
        const submissionsCollection: Collection = this.db.collection(this.collectionName);

        // Convert submissionId to ObjectId
        const objectIdSubmissionId = new ObjectId(submissionId);

        // Update the submission in the database
        const filter = { _id: objectIdSubmissionId };
        const updateDocument = { $set: updatedSubmission };
        const updateResult: UpdateResult = await submissionsCollection.updateOne(filter, updateDocument);

        // Return the update result
        return updateResult;
    } catch (error) {
        console.error('Error updating submission:', error);
        throw error;
    }
}


async deleteAssessmentFile(assessmentID: number): Promise<DeleteResult> {
    try {
        // Ensure database connection
        if (!this.db) {
            await this.connectToDatabase();
        }

        // Check if database connection is established
        if (!this.db) {
            throw new Error('Database connection is not established.');
        }

        // Access the submissions collection
        const submissionsCollection: Collection = this.db.collection(this.collectionName);

        // Convert submissionId to ObjectId
        const filter = { assessmentID: assessmentID };
        const deleteResult: DeleteResult = await submissionsCollection.deleteOne(filter);

        // Return the delete result
        return deleteResult;
    } catch (error) {
        console.error('Error deleting submission:', error);
        throw error;
    }
}

    
public async getAssessmentFileByAssessmentID(assessmentID: number): Promise<any> {
    try {
        if (!this.db) {
            await this.connectToDatabase();
        }

        if (!this.db) {
            throw new Error('Database connection is not established.');
        }
  

        const AssessmentCollection: Collection = this.db.collection(this.collectionName);
        // Ensure the query correctly references the nested fields
        const result = await AssessmentCollection.findOne({assessmentID:assessmentID});
        if (!result) {
            throw new Error('File not found.');
        }

        // Ensure the fields are correctly extracted from the result
        const file = result.file; // Assuming 'file' is a Buffer or similar binary data type
        return file
    } catch (error) {
        console.error('Error getting topic file:', error);
        throw error;
    }
}
public async getMongoIDSubmissionID(submissionID: number): Promise<any> {
    try {
        if (!this.db) {
            await this.connectToDatabase();
        }

        if (!this.db) {
            throw new Error('Database connection is not established.');
        }
  

        const SubmissionFile: Collection = this.db.collection(this.collectionName);
        // Ensure the query correctly references the nested fields
        const result = await SubmissionFile.findOne({submissionID:submissionID});
        if (!result) {
            throw new Error('File not found.');
        }

        // Ensure the fields are correctly extracted from the result
        const id = result._id; // Assuming 'file' is a Buffer or similar binary data type
        return id
    } catch (error) {
        console.error('Error getting mongo id  :', error);
        throw error;
    }
}

    private async connectToDatabase(): Promise<void> {
        const client = new MongoClient(this.uri);

        try {
            await client.connect();
            this.db = client.db();
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    // Implement other methods from SubmissionDAO interface as needed
}

export default assessmentMongo;
