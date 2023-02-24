const fs = require('fs');
const {parseStream} = require('fast-csv');
const {buildArraysTable, insertDrive} = require('./etl/helpers.js');

// Create the array name table
// buildArraysTable();

// Create read stream for csv.
const readStream = fs.createReadStream('./data/psids.csv');

// Options for reading csv file
const options = {
  quote: null,
  headers: true,
};

// Read csv file.
parseStream(readStream, options)
  .on('error', (error) => (console.log('parse stream error:', error)))
  .on('data', (row) => {
    
    let serial = row.SERIAL; 
    let psid = row.PSID;
    let arrayName = row.ARRAY;

    if (!psid) {
      psid = null;
    }

    if (!arrayName) {
      arrayName = null;
    }

    insertDrive(serial, psid, arrayName)
      .then((data) => {
        console.log('added:', data.insertId);
      })
      .catch((error) => (console.log(error)));

  })
  .on('end', (rowCount) => {
});
