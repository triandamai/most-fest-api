const mysql = require("mysql");

class Database {
  constructor(config) {
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "most-fest",
      port: 3306
    });
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
