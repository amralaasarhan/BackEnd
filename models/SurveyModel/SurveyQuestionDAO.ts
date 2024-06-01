import SurveyQuestion from "./SurveyQuestion";

interface SurveyQuestionDAO{
    addQuestion(question:SurveyQuestion):Promise<void>;
    editQuestion(questionId: number, updateData: any): Promise<void>;
    deleteQuestion(questionID:number):Promise<void>;
}export default SurveyQuestionDAO