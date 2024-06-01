"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DemoQuestion {
    constructor(A_QUESTION_ID, ASSESSMENT_ID_FK, QUESTION, QUESTION_LEVEL, QUESTION_TYPE, CORRECT_ANSWER, ANSWER_1, ANSWER_2, ANSWER_3, ANSWER_4, COURSE_ILO_ID_FK, WEIGHT) {
        this.A_QUESTION_ID = A_QUESTION_ID;
        this.ASSESSMENT_ID_FK = ASSESSMENT_ID_FK;
        this.QUESTION = QUESTION;
        this.QUESTION_LEVEL = QUESTION_LEVEL;
        this.QUESTION_TYPE = QUESTION_TYPE;
        this.CORRECT_ANSWER = CORRECT_ANSWER;
        this.ANSWER_1 = ANSWER_1;
        this.ANSWER_2 = ANSWER_2;
        this.ANSWER_3 = ANSWER_3;
        this.ANSWER_4 = ANSWER_4;
        this.COURSE_ILO_ID_FK = COURSE_ILO_ID_FK;
        this.WEIGHT = WEIGHT;
    }
}
exports.default = DemoQuestion;
