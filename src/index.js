const mysql = require("mysql2");
const inquirer = require("inquirer");

const connectionProperties = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "cms",
};

const connection = mysql.createConnection(connectionProperties);

const departmentQuestions = [
  {
    type: "number",
    name: "id",
    message: "What is your id?",
  },
  {
    type: "input",
    name: "name",
    message: "What is your name",
  },
];

const roleQuestions = [];
