// require('dotenv').config({path: '../.env'});
require('dotenv').config();

const mysql = require('mysql2');
const {HOST, DB_USER, DB_PASSWORD, DATABASE, PORT} = process.env;
// console.log(HOST, DB_USER, DB_PASSWORD, DATABASE, PORT);

const connection = mysql.createConnection({
  host: HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DATABASE,
  port: PORT
});

connection.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('MYSQL2 Connected!')
  }
});

module.exports = connection;
