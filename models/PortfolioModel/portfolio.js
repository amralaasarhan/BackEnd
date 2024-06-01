"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Portfolio {
    constructor(id = null, educationDegree, academicInstitute, techincalSkills, description, experience, studentID = null) {
        this.id = id;
        this.educationDegree = educationDegree;
        this.academicInstitute = academicInstitute;
        this.technicalSkills = techincalSkills;
        this.description = description;
        this.experience = experience;
        this.studentID = studentID;
    }
}
exports.default = Portfolio;
