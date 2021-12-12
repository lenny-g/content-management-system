const inquirer = require("inquirer");

const Db = require("./utils/Db");
const actionQuestions = require("./utils/questions");

const start = async () => {
  const db = new Db({
    host: process.envDB_HOST || "localhost",
    user: process.envDB_USER || "root",
    password: process.envDB_PASSWORD || "Password123!!",
    database: process.envDB_NAME || "company_db",
  });
};

await db.start();
start();
