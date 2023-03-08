import React, {useState, useEffect} from 'react';
import { GoX } from "react-icons/go";
import './DriveForm.css';

// ADD REGEXES HERE
const ARRAY_REGEX = /^([A-Z]{2}-[A-Z][0-9]{4})/im;
// Need to add serial prefix regex here
const SERIAL_PREFIXES = [
  '^(BTLP)',
'^(PHLP)',
'^(46NY)',
'^(FCNT)',
'^(5WNY)',
'^(45NY)',
'^(FCNB)',
'^(PHKD)',
'^(9A45)',
'^(9A41)',
'^(VYNA)',
'^(VWNA)',
'^(VWNE)',
'^(VYNY)',
'^(9150)',
'^(9151)',
'^(8235)',
'^(0117)',
'^(VXNA)',
'^(2A05)',
'^(FXTD)',
'^(71T0)',
'^(71S0)',
'^(MVNA)',
'^(71U0)',
'^(VXNE)',
'^(SDFU)',
'^(MVNE)',
'^(8229)',
'^(MYNE)',
'^(45NE)',
'^(70G0)',
'^(0B33)',
'^(45NA)',
'^(Z020)',
'^(45NF)',
'^(LYNE)',
'^(9A27)',
'^(LWNE)',
'^(1A21)',
'^(VZNY)',
'^(LWNA)',
'^(MWNE)',
'^(0B31)',
'^(7249)',
'^(1VWN)',
'^(MXNE)',
'^(9A42)',
'^(9152)',
'^(9A17)',
'^(1A33)',
'^(8226)',
'^(46NA)',
'^(0B23)',
'^(0B24)',
'^(5002)',
'^(0025)',
'^(0B25)',
'^(Y0U0)',
'^(FCNW)',
'^(Y0T0)',
'^(6050)',
'^(6040)',
'^(3110)',
'^(3160)',
'^(21R0)',
'^(21S0)',
'^(3190)',
'^(31B0)',
'^(8228)',
'^(8232)',
'^(31F0)',
'^(7144)',
'^(9149)',
'^(FNM0)',
'^(0119)',
'^(7143)',
'^(9A46)',
'^(7139)',
'^(9A47)',
'^(0B21)',
'^(FMD0)',
'^(9126)',
'^(S657)',
'^(FC30)',
'^(1A29)',
'^(8243)',
'^(8249)',
'^(8225)',
'^(6150)',
'^(SDFB)',
'^(3050)',
'^(3060)',
'^(3180)',
'^(1A28)',
'^(46NE)',
'^(VXNY)',
'^(SDFS)',
'^(9A43)',
'^(FNM1)',
'^(MWNA)',
'^(7145)',
'^(FMD1)',
'^(0B37)',
'^(60W0)',
'^(APM0)',
'^(5000)',
'^(70E0)',
'^(6160)',
'^(7141)',
'^(70L0)',
'^(M0NE)',
'^(0B44)',
'^(0B42)',
'^(2A11)',
'^(0118)',
'^(7110)',
'^(TLP8)',
'^(0B30)',
'^(2A12)',
'^(9A33)',
'^(9SNA)',
'^(7134)',
'^(42BX)',
'^(S6HE)',
'^(1A51)',
'^(31A0)',
'^(1A42)',
'^(1A52)',
'^(MZIL)',
'^(M3NA)',
'^(MXNA)',
'^(CF2C)',
'^(1TNY)',
'^(9UNA)',
'^(0242)',
'^(vxne)',
'^(vxna)',
'^(7140)',
'^(1A36)',
'^(MYNA)',
'^(S656)',
]
const SERIAL_PREFIX_REGEX = new RegExp (SERIAL_PREFIXES.join('|'));
const SERIAL_REGEX = /^([0-9A-Z]{11,18})/im;
const PSID_REGEX = /^([0-9A-Z]{32})/;

const DriveForm = ({addDriveHandler, closeFormHandler}) => {

  const [arrayName, setArrayName] = useState();
  const [serials, setSerials] =useState('');

  // const [drive, setDrive] = useState();
  
  const inputChange = (event) => {
    event.preventDefault();
    const {value, name} = event.target;
    if (name === 'array') {
      setArrayName(value);
    } else if (name === 'serials') {
      setSerials(value);
    }
  };

  function addDrives(event) {
    event.preventDefault();

    const infoToParse = serials.split('\n');
    const offendingEntries = [];

    for (let i = 0; i < infoToParse.length; i++) {
      const entry = infoToParse[i];
      if (i % 2 === 0 && !entry.match(SERIAL_REGEX) && !entry.match(SERIAL_PREFIX_REGEX)) {
        offendingEntries.push(entry);        
        window.alert(`BAD SERIAL FORMAT: '${entry === '' ? 'NO BLANK SPACE!': entry}'`)
      } else if (i % 2 === 1 && !entry.match(PSID_REGEX)) {
        offendingEntries.push(entry);
        window.alert(`BAD PSID FORMAT: '${entry === '' ? 'NO BLANK SPACE!': entry}'`)
      }
    }

    console.log('BAD ENTRY:', offendingEntries)

    if (offendingEntries.length === 0) {


      const drives = [];
      while (infoToParse.length) {
        const drive = {};
        drive.serial = infoToParse.shift();
        drive.psid = infoToParse.shift();
        drives.push(drive)
      }

      const driveInfo = {
        'array': arrayName ? arrayName : '',
        'drives': drives
      }

      console.log('adding drive: ', drives)
      addDriveHandler(driveInfo);
    }
  }

  return (
    <div className='DriveForm'>

      <div className='drive-form-header'>
        <h1>DriveForm</h1>
        <button onClick={closeFormHandler}>
          <GoX size={30}/>
        </button>
      </div>

      <form onSubmit={addDrives}>
        <label>
          Drive Array Location
          <input
            id='array'
            // type='text'
            name='array'
            onChange={inputChange}
            placeholder='Enter array name'
          /> 
        </label>
        <label>
          Serials and PSIDS
          <textarea
            id='serials'
            // className='serach-field-text'
            name='serials'
            placeholder='Enter each serial followed by the psid on a seperate line. &#10;EXAMPLE: &#10;SERIAL1234 &#10;PSID1234567890'
            onChange={inputChange}
          />
        </label>
        <button type='submit'>
          {/* <GoDriveForm size={20} /> */}
          ADD DRIVE
        </button>
      </form>
    </div>
  );
};

export default DriveForm;