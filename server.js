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

        // case 'Add Employee':{}

        // case 'Update Employee Role':{}

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
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.title}', '${response.salary}', (SELECT id FROM department WHERE name = '${response.dept}'))`);
                    init();
                });
            break;
        }

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

        case 'Quit':{
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
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Quit',
        ],
        name: 'choices',
    })
        .then((response) => {
            chooseOption(response.choices);
        });
};

init(); 