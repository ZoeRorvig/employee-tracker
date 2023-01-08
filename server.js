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
        case 'VIEW ALL DEPARTMENTS': {
            db.query('SELECT * FROM department', (err, departments) => {
                console.table(departments);
                init();
            });
            break;
        }
        case 'VIEW ALL ROLES': {
            db.query(`SELECT role.id, role.title, department.name AS department, role.salary 
            FROM role 
            JOIN department ON role.department_id = department.id`, (err, roles) => {
                console.table(roles);
                init();
            });

            // db.query('SELECT * FROM role', (err, roles) => {
            //     console.table(roles);
            //     init();
            // });
            break;
        }
        case 'VIEW ALL EMPLOYEES': {
            db.query('SELECT * FROM employee', (err, employees) => {
                console.table(employees);
                init();
            });
            break;
        }
    }
}

const init = () => {
    prompt({
        type: 'rawlist',
        message: 'Choose one of the following:',
        choices: [
            'VIEW ALL EMPLOYEES',
            'VIEW ALL DEPARTMENTS',
            'VIEW ALL ROLES',
        ],
        name: 'choices',
    })
        .then((response) => {
            chooseOption(response.choices);
        });
};

init(); 