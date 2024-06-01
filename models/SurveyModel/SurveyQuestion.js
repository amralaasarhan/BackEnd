"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SurveyQuestion {
    constructor(questionID = null, surveyID, question, q_type) {
        this.questionID = questionID;
        this.surveyID = surveyID;
        this.question = question;
        this.q_type = q_type;
    }
}
exports.default = SurveyQuestion;
