"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ObjectId } = require('mongodb');
class Course {
    constructor(courseId, courseName, courseLevel, courseHours) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.courseLevel = courseLevel;
        this.courseHours = courseHours;
        this.courseImage = null;
        this.courseTopics = [];
    }
}
exports.default = Course;
