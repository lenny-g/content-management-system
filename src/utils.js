const db = new Db({
  host: process.envDB_HOST || "localhost",
  user: process.envDB_USER || "root",
  password: process.envDB_PASSWORD || "password",
  database: process.envDB_NAME || "company_db",
});

await db.start();

if (chosenAction === "viewRoles") {
  const roles = await db.query("SELECT * FROM jobRole");
  console.table(roles);
}

if (chosenAction === "addRoles") {
  const generateDepartmentChoices = (departmentsFromDB) => {
    return departmentsFromDB.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });
  };

  const departments = await db.query("SELECT * FROM department");

  const roleQuestions = [
    {
      type: "list",
      message: "Please select a department:",
      name: "departmentId",
      choices: generateDepartmentChoices(departments),
    },
    {
      type: "input",
      message: "Please enter role title:",
      name: "title",
    },
    {
      type: "input",
      message: "Please enter role salary:",
      name: "salary",
    },
  ];

  const { departmentId, title, salary } = await inquirer.prompt(roleQuestions);

  await db.query(
    `INSERT INTO jobRole (title, salary, departmentId) VALUES("${title}", ${salary}, ${departmentId})`
  );
}

//

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
