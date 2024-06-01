import FeedbackAnswer from "./FeedbackAnswer";

interface FeedbackAnswerDAO { 
    addFeedbackAnswer(answer: FeedbackAnswer) : Promise<void>;
    
}export default FeedbackAnswerDAO