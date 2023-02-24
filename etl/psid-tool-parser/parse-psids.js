const fs = require('fs');

// Regexes to check entries
const ARRAY_REGEX = /^([A-Z]{2}-[A-Z][0-9]{4})/im;
const SERIAL_REGEX = /^([0-9A-Z]{11,18})/im;
const PSID_REGEX = /^([0-9A-Z]{32})/;

// Make sure to use the CLEANED psid list!!
const psidData = fs.readFileSync('./raw-data/psids-raw-clean.txt', 'utf8').split('<<>>\n');
const psids = [];

// Split up the psids into sub arrays
psidData.forEach((entry, i) => {
  const drivesInArray = entry.split('\n');
  psids.push(drivesInArray)
})

// Placeholder for current array
let arrayName = '';
const drives = {};
const crumbs = [];

for ( let i = 0; i < psids.length; i++) {
  
  // If the first row is an array name, set the array name.
  if (psids[i][0].match(ARRAY_REGEX)) {
    arrayName = psids[i][0];
  } else {
    // Otherwise leave blank.
    arrayName = '';
  }

  while (psids[i].length) {
    // Look at the first element in each array.
    const row = psids[i].shift();
    
    // If its a serial,
    if (row.match(SERIAL_REGEX) && row.length <= 18) {
      const serial = row;
      // check if second element is a psid.
      const psidCheck = psids[i][0];
      let psid = '';
      if (psidCheck.match(PSID_REGEX) && psidCheck.length === 32) {
        psid = psidCheck;
      }
      // Save the drive info as an object and add to array of drives.
      drives[serial] = {
        psid: psid,
        array: arrayName
      }
    } else {
      // If the above checks fail, save the row to parse later.
      crumbs.push(row);
    }
  }
  // Add a delimiter to keep things organized for next time.
  crumbs.push('<<>>')
}


// Turn drives object into a csv
let psidsCSV = 'SERIAL,PSID,ARRAY';
for (let key in drives) {
  psidsCSV += `\r\n${key},${drives[key].psid},${drives[key].array}`;
}

try {
  fs.writeFileSync('./parsed-data/psids.csv', psidsCSV);
} catch (error) {
  console.error(error)
}

// Save the crumbs to a text file to sort later.
try {
  fs.writeFileSync('./parsed-data/crumbs.txt', crumbs.join('\n'));
} catch (error) {
  console.error(error)
}