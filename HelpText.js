const fs = require('fs');

var AWS = require("aws-sdk");
// Set the region here
AWS.config.update({ region: "..." });

// Create DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const papa = require('papaparse')

//Set CSV file location here
var file = fs.createReadStream('...')
var csvData = []

var results = papa.parse(file,{
  header: true,
  dynamicTyping: true,
  download:true,
  step: function(result) {

    csvData.push({
      PutRequest:{ 
        Item: {
          frameworkId: {
            S: String(result.data.frameworkId)
          },
          sectionId: {
            S: result.data.sectionId
          },
          controlId: {
            S:  result.data.controlId
          },
          data: {
            S: result.data.data
          },
          referenceId: {
            S: result.data.referenceId 
          },
          helpText: {
            S: result.data.helpText
          }
        } 
      }
    })

  },
  complete: function(results, file) {
    const _results = {RequestItems: {
      HelpText: [
        ...csvData
      ]
    }}

    ddb.batchWriteItem(_results, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  }
});
