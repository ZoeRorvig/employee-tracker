const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const mysql = require('mysql2');
require('console.table');

const db = mysql.createConnection({
    user: 'root',
    database: 'employee_db',
});

const chooseOption = (type) => {
    switch (type) {

        case 'View All Employees': {
            db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, concat(manager.first_name," ", manager.last_name) AS manager
            FROM employee 
            JOIN role ON employee.role_id = role.id 
            JOIN department ON role.department_id = department.id 
            LEFT JOIN employee manager ON employee.manager_id = manager.id`, (err, employees) => {
                console.table(employees);
                init();
            });
            break;
        }

        // case 'View Employees By Manager': {} BONUS

        // case 'View Employees By Department': {} BONUS

        case 'Add Employee': {
            const role = [];
            const manager = [];
            db.query(`SELECT * FROM role`, (err, roles) => {
                for (let i = 0; i < roles.length; i++) {
                    role.push(roles[i].title);
                }
            });

            db.query(`SELECT CONCAT(first_name," ", last_name) AS name FROM employee WHERE manager_id IS NULL`, (err, managers) => {
                for (let i = 0; i < managers.length; i++) {
                    manager.push(managers[i].name);
                }
            });

            prompt([{
                type: 'input',
                message: 'What is the first name of the employee?',
                name: 'first_name',
            }, {
                type: 'input',
                message: 'What is the last name of the employee?',
                name: 'last_name',
            }, {
                type: 'rawlist',
                message: 'What is the role of the employee?',
                choices: role,
                name: 'role',
            }, {
                type: 'rawlist',
                message: 'Who is the manager of the employee?',
                choices: manager,
                name: 'manager',
            }])
                .then((response) => {
                    const managerName = response.manager.split(" ");

                    db.query(`SELECT id FROM role WHERE title = '${response.role}'`, (err, roleID) => {
                        db.query(`SELECT id FROM employee WHERE first_name = '${managerName[0]}' AND last_name = '${managerName[1]}'`, (err, managerID) => {
                            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.first_name}', '${response.last_name}', '${roleID[0].id}', '${managerID[0].id}')`, (err) => {
                                if (!err) {
                                    init();
                                }
                            })
                        })
                    })
                });

            // db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.first_name}', '${response.last_name}', (SELECT id FROM role WHERE title = '${response.role}'), (SELECT id FROM employee WHERE first_name = '${managerName[0]}' AND last_name = '${managerName[1]}'))`, (err) => {
            //     if (!err) {
            //         init();
            //     }
            // });
            break;
        }

        // case 'Update Employee Role':{}

        // case 'Update Employee Managers': {} BONUS

        // case 'Delete Employee': {} BONUS

        case 'View All Roles': {
            db.query(`SELECT role.id, role.title, department.name AS department, role.salary 
            FROM role 
            JOIN department ON role.department_id = department.id`, (err, roles) => {
                console.table(roles);
                init();
            });
            break;
        }

        case 'Add Role': {
            const dept = [];
            db.query(`SELECT * FROM department`, (err, departments) => {
                for (let i = 0; i < departments.length; i++) {
                    dept.push(departments[i].name);
                }
            });

            prompt([{
                type: 'input',
                message: 'What is the title of the role?',
                name: 'title',
            }, {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'salary',
            }, {
                type: 'rawlist',
                message: 'What department is this role in?',
                choices: dept,
                name: 'dept',
            }])
                .then((response) => {
                    db.query(`SELECT id FROM department WHERE name = '${response.dept}'`, (err, deptID) => {
                        db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.title}', '${response.salary}', ${deptID[0].id})`, (err) => {
                            if (!err) {
                                init();
                            }
                        })
                    });

                    //     db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.title}', '${response.salary}', (SELECT id FROM department WHERE name = '${response.dept}'))`);
                    //     init();
                });
            break;
        }

        // case 'Delete Role': {} BONUS

        case 'View All Departments': {
            db.query('SELECT * FROM department', (err, departments) => {
                console.table(departments);
                init();
            });
            break;
        }

        case 'Add Department': {
            prompt({
                type: 'input',
                message: 'What is the name of the department?',
                name: 'departmentName',
            })
                .then((response) => {
                    db.query(`INSERT INTO department (name) VALUES ('${response.departmentName}')`);
                    init();
                });
            break;
        }

        // case 'Delete Department': {} BONUS

        // case 'View Total Utilized Budget By Department': {} BONUS

        case 'Quit': {
            db.end();
            break;
        }
    }
}

const init = () => {
    prompt({
        type: 'rawlist',
        message: 'Choose one of the following:',
        choices: [
            'View All Employees',
            //'View Employees By Manager', BONUS
            //'View Employees By Department', BONUS
            'Add Employee',
            //'Update Employee Role',
            //'Update Employee Managers', BONUS
            //'Delete Employee', BONUS
            'View All Roles',
            'Add Role',
            //'Delete Role', BONUS
            'View All Departments',
            'Add Department',
            //'Delete Department', BONUS
            //'View Total Utilized Budget By Department', BONUS
            'Quit',
        ],
        name: 'choices',
    })
        .then((response) => {
            chooseOption(response.choices);
        });
};

init(); 