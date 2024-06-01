

class FeedbackAnswer{
    E_ANSWER_ID: number | null;
    FEEDBACK_ID_FK: number;
    ANSWER: string;
    QUESTION_ID_FK: number;
constructor (
    E_ANSWER_ID: number | null = null,
    FEEDBACK_ID_FK: number,
    ANSWER: string,
    QUESTION_ID_FK: number 
 ) {
    this.E_ANSWER_ID = E_ANSWER_ID;
    this.FEEDBACK_ID_FK = FEEDBACK_ID_FK;
    this.ANSWER = ANSWER;
    this.QUESTION_ID_FK = QUESTION_ID_FK;
 }
}export default FeedbackAnswer;
