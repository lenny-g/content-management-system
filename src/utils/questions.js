// starter questions
const actionQuestions = {
  type: "list",
  name: "chosenAction",
  message: "What would you like to do?",
  choices: [
    {
      value: "viewEmployee",
      name: "View all Employees",
    },
    {
      value: "addEmployee",
      name: "Add a new Employee",
    },
    {
      value: "updateEmployeeRole",
      name: "Update an Employee Role",
    },
    {
      value: "viewRoles",
      name: "View all Roles",
    },
    {
      value: "addRoles",
      name: "Add a new Role",
    },
    {
      value: "viewDepartments",
      name: "View all Departments",
    },
    {
      value: "addDepartment",
      name: "Add a new Department",
    },
    {
      value: "exit",
      name: "Exit",
    },
  ],
};

module.exports = actionQuestions;
