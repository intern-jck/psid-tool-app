const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
  
const {selectDrive, selectDrives, insertDrives, selectArray} = require('./db/model.js');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
  })
);

app.use(express.static('public'))

// CREATE
// Add drive to database.
app.post('/drives', (req, res) => {
  // console.log(req.body);
  // return;
  const driveInfo = req.body;
  insertDrives(driveInfo.drives, driveInfo.array)
    .then((data) => {
      console.log('added drive');
      res.sendStatus(201);
    })
    .catch((error) => (console.log('add drive:', error)));
});

// READ
// Get a drive info for a serial number
app.get('/serial', (req, res) => {
  const serial = req.query.serial;
  selectDrive(serial)
    .then((data) => {
      console.log('get /serial', data)
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// Get a drive info for multiple serial numbers
app.get('/serials', (req, res) => {
  const serials = req.query.serials;  
  // console.log('get /serials:', serials)
  selectDrives(serials)
    .then((data) => {
      // console.log('get /serials', data)s
      // res.sendStatus(200)
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// Get drive info for an array
app.get('/array', (req, res) => {
  const arrayName = req.query.array;
  // console.log(arrayName)
  selectArray(arrayName)
    .then((data) => {
      // console.log(data)
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// TODO: Implenent route to get multiple arrays
// app.get('/arrays', (req, res) => {
//   const arrays = req.query.arrays;
//   getArray(arrays)
//     .then((data) => {
//       console.log('arrays:', data)
//       // res.json(data);
//     })
//     .catch((error) => {
//       console.log(error);
//       res.sendStatus(500);
//     });
// });

// UPDATE
// TODO: Implenent route to update drive info
// app.put();

// DELETE
// TODO: Implenent route to delete drive
app.delete('/serial', (req, res) => {
  const serial = req.query.serial;
  deleteDrive(serial)
    .then((data) => {
      console.log('serial:', data)
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`psid server @ http://localhost:${port}`);
});
