const fs = require('fs');
const db = require('./connection.js');

// Creates table for all possible array names
function buildArraysTable() {
  // Build database of array names
  const labType = ['A', 'B', 'C'];
  const labLocation = ['LAB-1', 'LAB-2', 'LAB-3'];
  const arrayNumRange = 100;

  for (let i in labType) {
    for (let j in labLocation) {
      for (let k = 0; k < arrayNumRange; k++) {

        let arrayNum = '00';
        let arrayName = '';

        // Pad array number with leading zeros.
        if (k === 0) {
          arrayName = `${labType[i]}-${arrayNum}-${labLocation[j]}`;
        } else if (k < 10) {
          arrayNum = '000' + k.toString(10);
          arrayName = `${labType[i]}-${arrayNum}-${labLocation[j]}`;
        } else if (k < 100) {
          arrayNum = '00' + k.toString(10);
          arrayName = `${labType[i]}-${arrayNum}-${labLocation[j]}`;
        } else if (k < 1000) {
          arrayNum = '0' + k.toString(10);
          arrayName = `${labType[i]}-${arrayNum}-${labLocation[j]}`;
        } else if (k < 10000) {
          arrayNum = k.toString(10);
          arrayName = `${labType[i]}-${arrayNum}-${labLocation[j]}`;
        }

        const insertArray = `INSERT INTO arrays (array_name) VALUES ('${arrayName}');`;

        db.query(insertArray, (error, data) => {
          if (error) {
            throw error;
          }
          console.log('added:', arrayName)
        });

      }
    }
  }
};

// Test query for array table
async function testArraysQuery() {
  const query = `SELECT * FROM arrays LIMIT 1;`;
  try {
    const result = await db.promise().query(query);
    return result[0];
  } catch (error) {
    return error;
  }
};

// Get array id for given array name
// async function selectArrayId(arrayName) {
//   const query = `SELECT arrays.id FROM arrays WHERE array_name='${arrayName}';`;
//   try {
//     const result = await db.promise().query(query);
//     console.log('getArrayId:', result)
//     return result[0][0];
//   } catch (error) {
//     console.log('getArrayId:', error)
//   }
// };

// May not be needed
// function selectArrayId(db, arrayName) {
//   const query = `SELECT arrays.id FROM arrays WHERE array_name='${arrayName}';`;

//   // try {
//   //   const result = await db.promise().query(query);
//   //   console.log('getArrayId:', result)
//   //   return result[0][0];
//   // } catch (error) {
//   //   console.log('getArrayId:', error)
//   // }

//   return db.promise().query(query)
//     .then((result) => {
//       // console.log(result[0][0])
//       return result[0][0] ? result[0][0].id : null;
//     })
//     .catch((error) => {
//       console.log(error)
//     });

// };

// Get drive info
async function selectDrive(serial) {

  const query = `
    SELECT drives.serial, drives.psid, arrays.array_name
    FROM drives
    INNER JOIN arrays
    ON drives.array_id=arrays.id
    WHERE drives.serial='${serial}';
  `;

  // return db.promise()
  //   .query(query)
  //   .then((data) => {
  //     return data[0][0];
  //   })
  //   .catch((error) => (console.log('get drive error:', error)));

  try {
    const result = await db.promise().execute(query);
    return result[0];
  } catch (error) {
    logError(`SELECT ${serial}: ${error}`);
  }
};

// Add a drive psid to the database
async function insertDrive(serial, psid, arrayName) {

  // Arrays to build query string.
  let columns = [];
  let values = [];

  // To handle null values check for inputs and build query string.
  if (serial) {
    columns.push('serial');
    values.push(`'${serial}'`);
  }

  if (psid) {
    columns.push('psid');
    values.push(`'${psid}'`);
  }

  if (arrayName) {
    columns.push('array_id');
    values.push(`(SELECT id FROM arrays WHERE array_name='${arrayName}')`);
  }

  let insertString = `INSERT INTO drives (${columns})`;
  let valueString = `VALUES (${values})`;

  const query = `${insertString} ${valueString};`;

  // Add the drive to drives table.
  try {
    const result = await db.promise().execute(query);
    // logQuery(query);
    return result[0];
  } catch (error) {
    logError(`INSERT ${serial}: ${error}`);
  }

};

// Log errors to text file to review after etl process is over
function logError(error) {
  const currentTime = new Date().toISOString();
  const errorMsg = error;
  fs.appendFile('./logs/errorLogs.txt', `${currentTime}: ${errorMsg}\n`, (error) => {
    if (error) {
      throw error;
    }
  })
};

// Log queries
function logQuery(query) {
  const currentTime = new Date().toISOString();
  const queryMsg = query;
  fs.appendFile('./logs/queryLogs.txt', `${currentTime}: ${queryMsg}\n`, (error) => {
    if (error) {
      throw error;
    }
  })
};

module.exports = {
  buildArraysTable,
  testArraysQuery,
  selectDrive,
  insertDrive,
};
