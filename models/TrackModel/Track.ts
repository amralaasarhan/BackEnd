import Course from "../CourseModel/Course";

class Track {
  trackId:number
  title: string;
  description: string;
  pathSupervisorID: number;
  trackImage: string | null; 
  courses: Course[];

  constructor(trackId:number, title: string, description: string, pathSupervisorID: number) {
    this.trackId=trackId;
    this.title = title;
    this.description = description;
    this.pathSupervisorID = pathSupervisorID;
    this.trackImage = null;
    this.courses = [];
   
  }
}

export default Track;
