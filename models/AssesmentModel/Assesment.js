"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Assesment {
    constructor(assessmentType, instructorId, courseIloId, assessmentQuestionId, assessmentId, question, questionType, questionLevel, answerText, correctAnswer, answerId) {
        this.assesmentType = assessmentType;
        this.instructorId = instructorId;
        this.courseIloId = courseIloId;
        this.assesmentQuestionId = assessmentQuestionId;
        this.assesmentId = assessmentId;
        this.question = question;
        this.questionType = questionType;
        this.questionLevel = questionLevel;
        this.answerText = answerText;
        this.correctAnswer = correctAnswer;
        this.answerId = answerId;
    }
}
exports.default = Assesment;
