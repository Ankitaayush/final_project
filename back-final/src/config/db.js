const Mysql = require("mysql2");

const connnection = new Mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sloppycoder@15",
  database: "Assets",
});

module.exports = connnection;
