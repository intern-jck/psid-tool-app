import React, {useState, useEffect} from 'react';
import { GoPencil, GoClippy } from "react-icons/go";
import './Drive.css';

const Drive = ({drive, deleteHandler}) => {
  const [driveInfo, setDriveInfo] = useState(drive);
  const [canEdit, setCanEdit] = useState(false);

  const copyText = (event) => {
    event.preventDefault();
    const value = event.target.getAttribute('data-copy-value');
    navigator.clipboard.writeText(driveInfo[value]);
  };

  const inputChange = (event) => {
    event.preventDefault();
    if (canEdit) {
      const {name, value} = event.target;
      const updatedInput = {[name]: value};
      setDriveInfo((driveInfo) => ({
        ...driveInfo,
        ...updatedInput,
      }));
    }
  };

  const updateDrive = (event) => {
    event.preventDefault();
    console.log('update drive')
  };

  const deleteDrive = (event) => {
    event.preventDefault();
    deleteHandler(driveInfo.serial);
  };

  return (
    <form className={'Drive'} onSubmit={updateDrive}>

      <div className='drive-header'>
        <h3>DRIVE @ {drive.array_name}</h3>
        {/* TODO: Add edit and delete buttons */}
      </div>
      
      <div className='drive-info'> 

        <div className='drive-serial'>  
          <button>
            <GoClippy
              size={30}
              onClick={copyText}
              data-copy-value={'serial'}
              className={'icon'}
            />
          </button>
          <label htmlFor='drive-serial'>
            {/* <div className='drive-serial-input'>
            </div> */}
            SERIAL
          </label>
          <input
            id='drive-serial'
            type='text'
            name='serial'
            value={`${drive.serial}`}
            onChange={inputChange}
          />
        </div> 

        <div className='drive-psid'>          
          <button>
            <GoClippy
              size={30}
              onClick={copyText}
              data-copy-value={'psid'}
              className={'icon'}
            />
          </button>
          <label htmlFor='drive-psid'>
            PSID
          </label>
          <input
            id='drive-psid'
            type='text'
            name='psid'
            value={`${drive.psid}`}
            onChange={inputChange}
          />
        </div> 

      </div>

    </form>
  );
};

export default Drive;
