import { InsertOneResult } from "mongodb";
import Submission from "./Submission";

interface SubmissionDAO {
    addSubmission(submission: Submission): Promise<InsertOneResult<Submission>>;
    // You can add more methods here as needed
}

export default SubmissionDAO;
