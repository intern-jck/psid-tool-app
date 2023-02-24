const fs = require('fs');

// Get the raw list of psids and split up into an array based on delimiter
const psidList = fs.readFileSync('./raw-data/psids-raw.txt', 'utf8').split('\n');

const cleanedData = [];

// Regexes to check entries against.
const ARRAY_REGEX = /^([A-Z]{2}-[A-Z][0-9]{4})/im;
const SERIAL_REGEX = /^([0-9A-Z]{11,18})/im;
const PSID_REGEX = /^([0-9A-Z]{32})/;

// Ignore dates
const DATE_REGEX = /([0-9]{1}|[0-9]{2})\/([0-9]{1}|[0-9]{2})\/([0-9]{4}|[0-9]{2})/;
// Stuff to ignore
const IGNORE_ENTRIES = [
  'INDUS',
  'indus',
  'Indus',
  'DAE',
  'DPE',
  '[*]',
  'PSIDS',
  'PSID',
  'Durham',
  'Hopkinton',
  'Lab',
  'MTC',
  'Tabasco',
  'WX',
  'WK',
  'RT',
  'Fips',
  'in1',
  'in2',
  'in3',
  'IND',
  'IND1',
  'IND2',
  'IND3',
  '32 BL',
  'I1',
  'I2',
  'Warnado'
];
const IGNORE_REGEX = new RegExp(IGNORE_ENTRIES.join('|'), 'im');

while (psidList.length) {
  
  // First get rid of extra white space
  const entry = psidList.shift().trim();
  let cleanEntry = '';

  if (entry) {
    if (entry.match(ARRAY_REGEX)) {
      cleanEntry = entry.match(ARRAY_REGEX)[0].toUpperCase();
      cleanedData.push(cleanEntry);
    }

    // Simple check for serial in row
    else if (entry.match(SERIAL_REGEX) && entry.length <= 18) {
      // cleanEntry = entry.match(SERIAL_REGEX).input;
      cleanEntry = entry.match(SERIAL_REGEX)[0];
      cleanedData.push(cleanEntry)
    }

    // Check for psid
    else if (entry.match(PSID_REGEX)) {      
      cleanEntry = entry.match(PSID_REGEX).input;
      cleanedData.push(cleanEntry)
    }

    // Check for anything else, ignore the trash
    else if (!entry.match(IGNORE_REGEX) && !entry.match(DATE_REGEX) && !entry.match(PSID_REGEX) && entry.length > 8) {
      cleanEntry = entry;
      // Get rid of the string of --- delimiter
      if (entry.includes('--')) {
        cleanEntry = '<<>>'
      }
      cleanedData.push(cleanEntry)
    }

  }
}

try {
  fs.writeFileSync('./raw-data/psids-raw-clean.txt', cleanedData.join('\n'));
} catch (error) {
  console.error(error)
}