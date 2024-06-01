class CourseIlo {
    courseIloId: number
    courseId: number;
    courseOutcome: string;
    courseType: string;
    courseIloDescription: string;
    weight: number;

    constructor(courseIloId: number, courseOutcome: string, courseType: string, courseId: number, courseIloDescription: string, weight: number) {
        this.courseIloId = courseIloId;
        this.courseOutcome = courseOutcome;
        this.courseType = courseType;
        this.courseId = courseId;
        this.courseIloDescription = courseIloDescription;
        this.weight = weight;
    }
}

export default CourseIlo