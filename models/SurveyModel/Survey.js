"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Survey {
    constructor(surveyID = null, date = new Date(), courseFK = null, trackFK = null, questions = null, instructorFK = null) {
        this.surveyID = surveyID;
        this.date = date;
        this.courseFK = courseFK;
        this.trackFK = trackFK;
        this.questions = questions;
        this.instructorFK = instructorFK;
    }
}
exports.default = Survey;
