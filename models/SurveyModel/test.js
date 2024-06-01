const {default: SurveySQLServerDB} = require("./SurveySQLServerDB")
const sql = new SurveySQLServerDB(); 
const {default :Survey } = require("./Survey")

const survey = new Survey ( null, new Date(), null,null,null,null)
// sql.addSurvey(survey).then(result => {
//     console.log('New Survey:', result);
//   });

  sql.getSurvey(null,null).then(result => {
    console.log('survey = :', result);
  });
