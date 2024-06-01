"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DemoAssessment {
    constructor(assessmentID, assessmentType, instructorID, supervisorID, courseID, createdAt, deadline, name, description, grade, questions) {
        this.assessmentID = assessmentID;
        this.assessmentType = assessmentType;
        this.instructorID = instructorID;
        this.supervisorID = supervisorID;
        this.courseID = courseID;
        this.createdAt = createdAt;
        this.deadline = deadline;
        this.name = name;
        this.description = description;
        this.grade = grade;
        this.questions = questions;
    }
}
exports.default = DemoAssessment;
