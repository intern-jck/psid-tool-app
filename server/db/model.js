const db = require('./connection.js');

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
async function selectArrayId(arrayName) {
  const query = `SELECT arrays.id FROM arrays WHERE array_name='${arrayName}';`;
  try {
    const result = await db.promise().query(query);
    return result[0][0];
  } catch (error) {
    console.log('getArrayId:', error)
  }
};

// Get drive info
async function selectDrive(serial) {
  
  const query = `
    SELECT drives.serial, drives.psid, arrays.array_name
    FROM drives
    INNER JOIN arrays
    ON drives.array_id=arrays.id
    WHERE drives.serial='${serial}';
  `;

  try {
    const result = await db.promise().execute(query);
    return result[0];
  } catch (error) {
    logError(`SELECT ${serial}: ${error}`);
  }
};

async function selectDrives(serials) {
  // console.log('select drives for: ', serials)

  const values = [];
  serials.forEach((serial) => {
    if (serial) {
      // console.log(serial)
      values.push(serial);
    }
  });
  const valuesString = values.join('\',\'');
  // console.log(valuesString)
  // return;

  const query = `
    SELECT drives.serial, drives.psid, arrays.array_name
    FROM drives
    INNER JOIN arrays
    ON drives.array_id=arrays.id
    WHERE drives.serial IN ('${valuesString}');
  `;
    
  try {
    const result = await db.promise().execute(query);
    // console.log('got:', result[0])
    return result[0];
  } catch (error) {
    logError(`SELECT ${serials}: ${error}`);
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

// Add a drive psid to the database
async function insertDrives(drives, arrayName) {

  // Arrays to build query string.\
  let insertString = `INSERT INTO drives (serial, psid, array_id)`;

  const values = [];

  for (let i in drives) {
    console.log(drives[i])
    const value = `('${drives[i].serial}','${drives[i].psid}',(SELECT id FROM arrays WHERE array_name='${arrayName}'))`;
      values.push(value);
  }
  console.log(insertString, 'VALUES ', `(${values.join(',')});`)
  return;

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
async function selectArray(array) {
  
  const query = `SELECT drives.serial, drives.psid, arrays.array_name
    FROM drives
    INNER JOIN arrays
    ON drives.array_id=arrays.id
    WHERE arrays.array_name='${array}';`;

  // return db.promise()
  //   .query(query)
  //   .then((data) => {
  //     return data[0];
  //   })
  //   .catch((error) => (console.log('get array:', error)));

  try {
    const result = await db.promise().execute(query);
    return result[0];
  } catch (error) {
    logError(`SELECT ${serials}: ${error}`);
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
  testArraysQuery,
  selectDrive,
  selectDrives,
  selectArray,
  selectArrayId,
  insertDrives,
};
