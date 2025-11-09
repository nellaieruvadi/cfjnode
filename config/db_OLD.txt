// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'cfj_ws_user',        // replace with your DB user
  password: '2say(ar-p/45z!5p',// replace with your DB password
  database: 'cvforjobs',// replace with your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
