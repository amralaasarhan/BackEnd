import Assesment from "./Assesment";
interface AssesmentDAO {
    addAssesment(assesmentType: string, courseIloId: number) : Promise<void>
    addAssesmentQuestion(assesmentId: number, question: string, questionType: string, questionLevel: string) : Promise<void>
    addAnswer(assesmentQuestionId: number, answerText: string, correctAnswer: string) : Promise<void>
    addAnswer(assesmentQuestionId: number, answerText: string, correctAnswer: string) : Promise<void>
    deleteAssesment(assesmentId: number) : Promise<void>
    addAssesmentQuestionAndCourseTopic(assesmentQuestionId: number,courseTopicId:number): Promise<void>
    deleteAssesmentQuestion(assesmentQuestionId: number) : Promise<void>
    deleteAnswer(answerId: number) : Promise<void>
    getAssessments(): Promise<any[]>
    getAssessmentByCourseIloId(courseIloId: number): Promise<any[]>
    getAssessmentQuestions(): Promise<any[]>
    getAssessmentQuestionsByAssessmentId(assessmentId: number): Promise<any[]>
    getAnswerByAssessmentQuestionId(assesmentQuestionId: number) : Promise<any[]>

}
export default AssesmentDAO