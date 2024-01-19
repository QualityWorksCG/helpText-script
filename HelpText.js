const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const papa = require("papaparse");

var AWS = require("aws-sdk");
// Set the region here
AWS.config.update({ region: process.env.REGION });


// Create DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

//Set CSV file location here
var file = fs.createReadStream(process.env.FILE_PATH);

var csvData = [];

var results = papa.parse(file, {
  header: true,
  dynamicTyping: true,
  download: true,
  step: function (result) {
    csvData.push({
      PutRequest: {
        Item: {
          frameworkId: {
            S: String(result.data.frameworkId),
          },
          sectionId: {
            S: result.data.sectionId,
          },
          categoryId: {
            S: result.data.categoryId || '',
          },
          PK: {
            S: result.data.requirementId,
          },
          referenceId: {
            S: result.data.referenceId,
          },
          helpText: {
            S: result.data.helpText,
          },
        },
      },
    });
  },
  complete: function (results, file) {
    let i, j, batch;

    for (i = 0, j = csvData.length; i < j; i += process.env.BATCH_SIZE) {
      batch = csvData.slice(Number(i), Number(i) + Number(process.env.BATCH_SIZE));
      var tableName = process.env.TABLE_NAME;
      const _results = {
        RequestItems: {
         'Posture3Stack-requirementhelptexttable7E3547FF-O9M1BHNMLWE1': [...batch],
        },
      };

      ddb.batchWriteItem(_results, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
    }
  },
});
