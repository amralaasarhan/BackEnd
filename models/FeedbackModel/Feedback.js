"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Feedback {
    constructor(FEEDBACK_ID = null, SURVEY_ID, STUDENT_ID_FK, date, answers = null) {
        this.FEEDBACK_ID = FEEDBACK_ID;
        this.SURVEY_ID = SURVEY_ID;
        this.STUDENT_ID_FK = STUDENT_ID_FK;
        this.date = date;
        this.answers = answers;
    }
}
exports.default = Feedback;
