class Assesment {
  assesmentType: string;
  instructorId: number;
  courseIloId: number;
  assesmentQuestionId: number;
  assesmentId: number;
  question: string;
  questionType: string;
  questionLevel: string;
  answerText: string;
  correctAnswer: string;
  answerId: number;

  constructor(assessmentType: string, instructorId: number, courseIloId: number, assessmentQuestionId: number, assessmentId: number, question: string, questionType: string, questionLevel: string, answerText: string, correctAnswer: string,  answerId: number) {
    this.assesmentType = assessmentType;
    this.instructorId = instructorId;
    this.courseIloId = courseIloId;
    this.assesmentQuestionId = assessmentQuestionId;
    this.assesmentId = assessmentId;
    this.question = question;
    this.questionType = questionType;
    this.questionLevel=questionLevel;
    this.answerText = answerText;
    this.correctAnswer = correctAnswer;
    this.answerId=answerId;
  }
}
export default Assesment;