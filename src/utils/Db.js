const mysql = require("mysql2");

class Db {
  constructor(dbOptions) {
    this.dbOptions = dbOptions;
    this.connection = mysql.createConnection(dbOptions);
  }

  start() {
    return new Promise((resolve, reject) => {
      const onConnect = (err) => {
        if (err) {
          console.error(`[ERROR]: ${err.message}`);
          return reject(err.message);
        }

        console.log(
          `Connected successfully to the ${this.dbOptions.database} database`
        );

        resolve();
      };

      this.connection.connect(onConnect);
    });
  }

  stop() {
    this.connection.end();
    console.log(
      `Successfully disconnected from ${this.dbOptions.database} database`
    );
  }

  query(sqlQuery) {
    return new Promise((resolve, reject) => {
      this.connection.query(sqlQuery, (err, result) => {
        if (err) {
          console.error(`[ERROR]: ${err.message}`);
          return reject(err.message);
        }

        resolve(result);
      });
    });
  }
}

module.exports = Db;
