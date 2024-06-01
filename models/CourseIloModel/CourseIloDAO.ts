interface CourseIloDAO {
    addCourseIlo(
        courseOutcome: string,
        courseType: string,
        courseId: number,
        courseIloDescription:string
    ): Promise<void>;
    deleteCourseIlo(courseId: number): Promise<void>;
    updateCourseIlo(filter:any, updateData: any): Promise<void>;
  }

  export default CourseIloDAO