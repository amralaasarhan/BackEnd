class Submission {
    studentId: number;
    file: any; // This can be the actual file data or a reference to the file location
    submissionID: number;

    constructor(studentId: number, file: any, submissionID: number) {
        this.studentId = studentId;
        this.file = file;
        this.submissionID = submissionID;
    }
}

export default Submission;
