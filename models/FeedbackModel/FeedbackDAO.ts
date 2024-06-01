import Feedback from "./Feedback";

interface FeedbackDAO { 
    addFeedback(feedback:Feedback) :Promise<void>;
    getFeedback(surveyID:number): Promise<Feedback[]>;
    deleteFeedback(feedbackID: number): Promise<void>;
    editFeedback(feedbackID:number, updateData:any) : Promise<void>;
} export default FeedbackDAO