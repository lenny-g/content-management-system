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

  await db.start();

  let inProgress = true;

  while (inProgress) {
    const { chosenAction } = await inquirer.prompt(actionQuestions);
    if (chosenAction === "viewEmployee") {
      console.log("viewEmployees");
    }

    if (chosenAction === "addEmployee") {
    }

    if (chosenAction === "updateEmployeeDepartment") {
      console.log("updateEmployeeDepartment");
    }

    if (chosenAction === "viewRoles") {
      console.log("viewRoles");
    }

    if (chosenAction === "addRoles") {
      console.log("addRoles");
    }

    if (chosenAction === "viewDepartments") {
      console.log("viewDepartments");
    }

    if (chosenAction === "addDepartment") {
      console.log("addDepartment");
    }

    if (chosenAction === "exit") {
      console.log("exit");
    }
  }
};

start();
