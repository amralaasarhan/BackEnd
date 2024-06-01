import DemoQuestion from "./demoQuestion";


class DemoAssessment {
    assessmentID: number;
    assessmentType: string;
    instructorID: number;
    supervisorID: number;
    courseID: number;
    createdAt: Date;
    deadline: Date;
    name: string;
    description: string;
    grade: number;
    questions: DemoQuestion[] | null ;

    constructor(
        assessmentID: number,
        assessmentType: string,
        instructorID: number,
        supervisorID: number,
        courseID: number,
        createdAt: Date,
        deadline: Date,
        name: string,
        description: string,
        grade: number,
        questions: DemoQuestion[] | null 
    ) {
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
}export default DemoAssessment
