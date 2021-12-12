USE company_db;


-- view all departments
SELECT * FROM department;

-- view all roles
SELECT * FROM jobRole

-- view all employees
SELECT * FROM employee

-- view all roles
SELECT jobRole.title, department.name, jobRole.salary FROM jobRole JOIN department ON jobRole.departmentId = department.id ORDER BY department.name;

-- view all employees
SELECT CONCAT(e.firstName,' ', e.lastName) AS 'USER', j.salary, j.title, d.name,
      CONCAT( m.firstName,' ',  m.lastName) AS MANAGER
FROM employee AS e JOIN employee AS m ON e.managerId = m.id INNER JOIN jobRole j ON e.jobRoleId = j.id LEFT JOIN department d ON j.departmentId = d.id ;

-- add new emploloyee 
INSERT INTO employee (firstName, lastName, jobRoleId, managerId) VALUES("${firstName}", "${lastName}", ${jobRoleId}, ${managerId})

-- add new role
INSERT INTO jobRole (title, salary, departmentId) VALUES("${title}", ${salary}, ${departmentId})

-- add new department
INSERT INTO department (name) VALUES("${newDepartment}")

-- update employee role
UPDATE employee SET jobRoleId = ${jobRoleId} WHERE id = ${id}