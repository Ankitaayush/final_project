const Mysql = require("mysql2");

const connnection = new Mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Harryjust831",
  database: "Assets",
});

module.exports = connnection;
