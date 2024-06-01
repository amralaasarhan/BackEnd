"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CourseTopic {
    constructor(courseTopicId, topicName, courseId, courseIloId) {
        this.courseTopicId = courseTopicId;
        this.topicName = topicName;
        this.courseIloId = courseIloId;
        this.courseId = courseId;
        this.files = [];
    }
}
exports.default = CourseTopic;
