const fs = require("fs");
require("dotenv").config();
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
          controlId: {
            S: result.data.controlId,
          },
          data: {
            S: result.data.data,
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
    var i, j, batch;

    for (i = 0, j = csvData.length; i < j; i += process.env.BATCH_SIZE) {
      batch = csvData.slice(i, i + process.env.BATCH_SIZE);
      const _results = {
        RequestItems: {
          HelpText: [...batch],
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
