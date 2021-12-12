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
      const employees = await db.query(`
      SELECT CONCAT(e.firstName,' ', e.lastName) AS 'USER', j.salary, j.title, d.name,
      CONCAT( m.firstName,' ',  m.lastName) AS MANAGER
      FROM employee AS e JOIN employee AS m ON e.managerId = m.id INNER JOIN jobRole j ON e.jobRoleId = j.id LEFT JOIN department d ON j.departmentId = d.id ;`);
      console.table(employees);
    }

    if (chosenAction === "addEmployee") {
      console.log("addEmployee");
    }

    if (chosenAction === "updateEmployeeDepartment") {
      console.log("updateEmployeeDepartment");
    }

    if (chosenAction === "viewRoles") {
      const roles =
        await db.query(`SELECT jobRole.title, department.name, jobRole.salary FROM jobRole JOIN department ON jobRole.departmentId = department.id ORDER BY department.name;

      `);
      console.table(roles);
    }

    if (chosenAction === "addRoles") {
      console.log("addRoles");
    }

    if (chosenAction === "viewDepartments") {
      const departments = await db.query(`SELECT * FROM department;`);
      console.table(departments);
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
