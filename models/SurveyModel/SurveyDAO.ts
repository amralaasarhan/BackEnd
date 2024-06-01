import Survey from "./Survey";

interface SurveyDAO { 
     addSurvey(survey:Survey) : Promise<void>;
     getSurvey(id: number, idType: string): Promise<Survey>;
     deleteSurvey(surveyID: number): Promise<void>;
     editSurvey(survey:Survey): Promise<void>;

} export default SurveyDAO