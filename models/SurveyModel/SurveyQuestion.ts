class SurveyQuestion{
questionID : number | null 
surveyID : number;
question : string;
q_type : string; 

constructor (
    questionID: number | null = null,
    surveyID: number,
    question: string,
    q_type: string 
 ) {
    this.questionID = questionID;
    this.surveyID = surveyID;
    this.question = question;
    this.q_type = q_type;
 }
} export default SurveyQuestion