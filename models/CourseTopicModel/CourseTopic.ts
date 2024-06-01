import { ObjectId } from 'mongodb';

interface File {
  fileName: string;
  fileSize: number;
}

class CourseTopic {
  courseTopicId: number;
  topicName:String;
  courseIloId:number;
  courseId:number;
  files: File[];

  constructor(courseTopicId: number,topicName:String,courseId:number,courseIloId:number) {
    this.courseTopicId = courseTopicId;
    this.topicName=topicName;
    this.courseIloId =courseIloId
    this.courseId=courseId
   
    this.files = [];
  }

}

export default CourseTopic;