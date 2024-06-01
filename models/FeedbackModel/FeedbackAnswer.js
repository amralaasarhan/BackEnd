"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FeedbackAnswer {
    constructor(E_ANSWER_ID = null, FEEDBACK_ID_FK, ANSWER, QUESTION_ID_FK) {
        this.E_ANSWER_ID = E_ANSWER_ID;
        this.FEEDBACK_ID_FK = FEEDBACK_ID_FK;
        this.ANSWER = ANSWER;
        this.QUESTION_ID_FK = QUESTION_ID_FK;
    }
}
exports.default = FeedbackAnswer;
