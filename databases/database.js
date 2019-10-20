const mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "most-fest",
  port: 3306
});

con.connect(function(err) {
  if (err) throw err;
  console.log("connect to database");
});

module.exports = con;
