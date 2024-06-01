import FeedbackAnswer from "./FeedbackAnswer";


class Feedback {
    FEEDBACK_ID: number | null ; 
    SURVEY_ID: number;
    STUDENT_ID_FK: number;
    date: Date;
    answers: FeedbackAnswer[]| null 
    constructor (
        FEEDBACK_ID: number | null = null,
        SURVEY_ID: number,
        STUDENT_ID_FK: number,
        date: Date,
        answers: FeedbackAnswer[]| null = null
    ) {
        this.FEEDBACK_ID = FEEDBACK_ID;
        this.SURVEY_ID = SURVEY_ID;
        this.STUDENT_ID_FK = STUDENT_ID_FK;
        this.date = date;
        this.answers=answers
     }
}
 export default Feedback