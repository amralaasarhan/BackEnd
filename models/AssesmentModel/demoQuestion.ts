class DemoQuestion {
    A_QUESTION_ID: number;
    ASSESSMENT_ID_FK: number;
    QUESTION: string;
    QUESTION_LEVEL: string;
    QUESTION_TYPE: string;
    CORRECT_ANSWER: string | null;
    ANSWER_1: string | null;
    ANSWER_2: string | null;
    ANSWER_3: string | null;
    ANSWER_4: string | null;
    COURSE_ILO_ID_FK: number;
    WEIGHT: number;

    constructor(
        A_QUESTION_ID: number,
        ASSESSMENT_ID_FK: number,
        QUESTION: string,
        QUESTION_LEVEL: string,
        QUESTION_TYPE: string,
        CORRECT_ANSWER: string | null,
        ANSWER_1: string | null,
        ANSWER_2: string | null,
        ANSWER_3: string | null,
        ANSWER_4: string | null,
        COURSE_ILO_ID_FK: number,
        WEIGHT: number
    ) {
        this.A_QUESTION_ID = A_QUESTION_ID;
        this.ASSESSMENT_ID_FK = ASSESSMENT_ID_FK;
        this.QUESTION = QUESTION;
        this.QUESTION_LEVEL = QUESTION_LEVEL;
        this.QUESTION_TYPE = QUESTION_TYPE;
        this.CORRECT_ANSWER = CORRECT_ANSWER;
        this.ANSWER_1 = ANSWER_1;
        this.ANSWER_2 = ANSWER_2;
        this.ANSWER_3 = ANSWER_3;
        this.ANSWER_4 = ANSWER_4;
        this.COURSE_ILO_ID_FK = COURSE_ILO_ID_FK;
        this.WEIGHT = WEIGHT;
    }
}export default DemoQuestion
