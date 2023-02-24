import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar.jsx';
import Search from './components/Search/Search.jsx';
import DriveList from './components/Drives/DriveList.jsx';

// Import styles
import './App.css';

const SERVER_URL = 'http://localhost:3000';

const App = () => {
  const [drives, setDrives] = useState([]);
  // const [currentDrives, setCurrentDrives] = useState();s

  useEffect(() => {
    // Use for testing
    getDrivesBySerialList(['BTLP8390002E1P9A']);
    // getDrivesBySerialList(['BTLP8390002E1P9A','BTLP8392008D1P9A','BTLP8393012P1P9A']);
    // getDrivesByArray('WX-H0211');
  }, []);

  // CREATE
  const addDrive = (driveInfo) => {
    // event.preventDefault();
    // console.log(event.target)
    // console.log('adding', serial, psid, arrayName)
    // axios.post(`${SERVER_URL}/create`, data)
    //   .then((response) => {
    //     console.log('create drive', response.data);
    //     getDrives();
    //   })
    //   .catch((error) => ('Create Error', console.log(error)));
  };

  // READ
  const getDrivesByArray = (arrayName) => {
    console.log('drives by array', arrayName)

    axios.get(`${SERVER_URL}/array`, {params: {array: arrayName}})
      .then((response) => {
        console.log('array got:', response.data)
        if (response.data.length > 0) {
          setDrives(response.data);
        } else {
          window.alert('NO DRIVES FOUND!');            
        }
      })
      .catch((error) => (console.log('get drive by serial', error)));
  };

  const getDrivesBySerialList = (serials) => {
    console.log('get serials', serials)
    if (serials.length > 0) {         
      axios.get(`${SERVER_URL}/serials`, {params: {serials: serials}})
        .then((response) => {
          console.log('res:', Object.keys(response.status))

          if (response.data) {
            console.log('got serials', response.data)
            if (response.data.length > 0) {
              setDrives(response.data);
            } else {
              window.alert('NO DRIVES FOUND!');            
            }
          }

          // else {
          //   console.log('NO DRIVE FOUND!');
          // }

        })
        .catch((error) => (console.log('get drive by serial', error)));
    }
  };

  const addDrives = (driveInfo) => {
    console.log('post:', driveInfo)
    
    axios.post(`${SERVER_URL}/drives`, driveInfo)
    .then((response) => {
      // if (response) {
      //   console.log('added drives:', response.status)
      // }
      console.log('res:', response)
      // if (response.data) {
      // }
    })
    .catch((error) => (console.log('get drive by serial', error)));
  }

  return (
    <>
      <Navbar 
        addHandler={addDrive}      
      />
      <section>
        <Search
          searchArray={getDrivesByArray}
          searchSerials={getDrivesBySerialList}
        />
        
        <DriveList
          drives={drives}
          // deleteHandler={deleteDrive}
          // updateHandler={updateDrive}
          addDriveHandler={addDrives}
        />

        {/* {
          drives ?
          <DriveList
            drives={drives}
            // deleteHandler={deleteDrive}
            // updateHandler={updateDrive}
          /> :
          null
        }       */}
      </section>
    </>
  );

};

export default App;
