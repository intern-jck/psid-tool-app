import React, {useState, useEffect} from 'react';
import Drive from './Drive.jsx';
import DriveForm from './DriveForm.jsx';
import './DriveList.css';
import { GoFile, GoPlus } from "react-icons/go";

const DriveList = ({drives, submitHandler, deleteHandler, addDriveHandler}) => {
  
  const [showDriveForm, setShowDriveForm] = useState(true);

  const toggleForm = (event) => {
    console.log('add psid');
    setShowDriveForm(!showDriveForm);
  };

  const getPsidList = (event) => {
    const {name, value} = event.target;
    console.log(drives);
    let psidList = '';
    for (let drive of drives) {
      psidList += drive.psid + '\n';
    }
    console.log(psidList);
    
    navigator.clipboard.writeText(psidList);
  };

  const getCmdsList = (event) => {
    console.log('get cmds list')
  };

  return (
    <div className='DriveList'>
      <div className='list-header'>
        <h1>Drive List</h1>
        <div className='list-tool-btns'>
          <span className='add-psid-btn'>
            ADD PSID
            <button onClick={toggleForm}>
              <GoPlus size={30} />
            </button>
          </span>
          <span className='get-list-btn'>
            GET PSIDS
            <button onClick={getPsidList}>
              <GoFile size={30} />
            </button>
          </span>
          <span className='get-cmds-btn'>
            GET CMDS
            <button onClick={getCmdsList}>
              <GoFile size={30} />
            </button>
          </span>
        </div>
      </div>
      <div className='list-content'>
        {
          drives.map((drive, i) => {
            return (
              <Drive key={i} drive={drive} deleteHandler={deleteHandler}/>
            );
          })
        }
      </div>

      {
        showDriveForm ?
          <DriveForm addDriveHandler={addDriveHandler} closeFormHandler={toggleForm}/>
          : null
      }

    </div>
  );

};

export default DriveList;
