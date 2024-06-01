import SurveyQuestion from "./SurveyQuestion";

class Survey { 
    surveyID : number | null
    date : Date;
    courseFK : number | null
    trackFK : number | null
    questions : SurveyQuestion[] | null 
    instructorFK : number | null 

    constructor (
        surveyID: number | null = null,
        date: Date = new Date(),
        courseFK: number | null = null,
        trackFK: number | null = null,
        questions: SurveyQuestion[]| null = null,
        instructorFK : number | null = null 
     ) {
        this.surveyID = surveyID;
        this.date = date;
        this.courseFK = courseFK;
        this.trackFK = trackFK;
        this.questions=questions
        this.instructorFK = instructorFK
     }
} export default Survey