const inquirer = require("inquirer");
const {
  generateDepartmentChoices,
  generateRoleChoices,
  generateManagerChoices,
  generateEmployeeChoices,
} = require("./utils/utils");

const title = `

███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗
██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝
█████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗  
██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝  
███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗
╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝
████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗ 
╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
   ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝
   ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
   ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
`;

const Db = require("./utils/Db");
const actionQuestions = require("./utils/questions");

const db = new Db({
  host: process.envDB_HOST || "localhost",
  user: process.envDB_USER || "root",
  password: process.envDB_PASSWORD || "Password123!!",
  database: process.envDB_NAME || "company_db",
});

const start = async () => {
  console.log(title);

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
      const role = await db.query("SELECT * FROM jobRole");
      const employee = await db.query("SELECT * FROM employee");

      const employeeQuestions = [
        {
          type: "input",
          message: "Please enter employee's first name:",
          name: "firstName",
        },
        {
          type: "input",
          message: "Please enter employee's last name:",
          name: "lastName",
        },
        {
          type: "list",
          message: "Please select a role:",
          name: "jobRoleId",
          choices: generateRoleChoices(role),
        },
        {
          type: "list",
          message: "Please select a Manager:",
          name: "managerId",
          choices: generateManagerChoices(employee),
        },
      ];

      const { jobRoleId, firstName, lastName, managerId } =
        await inquirer.prompt(employeeQuestions);

      await db.query(
        `INSERT INTO employee (firstName, lastName, jobRoleId, managerId) VALUES("${firstName}", "${lastName}", ${jobRoleId}, ${managerId})`
      );
      console.log(`Added ${firstName} ${lastName} to the database.`);
    }

    if (chosenAction === "updateEmployeeRole") {
      const employee = await db.query("SELECT * FROM employee");
      const role = await db.query("SELECT * FROM jobRole");

      const updateEmployeeQuestions = [
        {
          type: "list",
          message: "Which employee would you like to update?",
          name: "id",
          choices: generateEmployeeChoices(employee),
        },
        {
          type: "list",
          message:
            "What role would you like to assign to the selected employee?",
          name: "jobRoleId",
          choices: generateRoleChoices(role),
        },
      ];

      const { id, jobRoleId } = await inquirer.prompt(updateEmployeeQuestions);

      await db.query(
        `UPDATE employee SET jobRoleId = ${jobRoleId} WHERE id = ${id}`
      );
      console.log(`Employee Role has been updated`);
    }

    if (chosenAction === "viewRoles") {
      const roles =
        await db.query(`SELECT jobRole.title, department.name, jobRole.salary FROM jobRole JOIN department ON jobRole.departmentId = department.id ORDER BY department.name;
 `);
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

      const { departmentId, title, salary } = await inquirer.prompt(
        roleQuestions
      );

      await db.query(
        `INSERT INTO jobRole (title, salary, departmentId) VALUES("${title}", ${salary}, ${departmentId})`
      );
    }

    if (chosenAction === "viewDepartments") {
      const departments = await db.query(`SELECT * FROM department 
      `);
      console.table(departments);
    }

    if (chosenAction === "addDepartment") {
      const departmentQuestions = [
        {
          type: "input",
          message: "Please enter new department:",
          name: "newDepartment",
        },
      ];

      const { newDepartment } = await inquirer.prompt(departmentQuestions);

      await db.query(
        `INSERT INTO department (name) VALUES("${newDepartment}")
         `
      );
      console.log(`Added ${newDepartment} to the database`);
    }

    if (chosenAction === "exit") {
      inProgress = false;
      process.exit(0);
    }
  }
};
start();
