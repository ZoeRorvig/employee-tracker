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

            db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, concat(manager.first_name," ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id', (err, employees) => {
                console.table(employees);
                init();
            });
            break;
        }

        case 'View Employees By Manager': {
            db.query(`SELECT CONCAT(first_name," ", last_name) AS name FROM employee WHERE manager_id IS NULL`, (err, managers) => {
                prompt({
                    type: 'rawlist',
                    message: 'Who is the manager of the employee?',
                    choices: function () {
                        const manager = [];
                        for (let i = 0; i < managers.length; i++) {
                            manager.push(managers[i].name);
                            return manager;
                        }
                    },
                    name: 'manager',
                })
                    .then((response) => {
                        db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, concat(manager.first_name," ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id WHERE concat(manager.first_name," ", manager.last_name) = ?', response.manager, (err, employees) => {
                            if (!err) {
                                console.table(employees);
                                init();
                            }
                        })
                    });
            })
            break;
        }

        case 'View Employees By Department': {
            db.query(`SELECT * FROM department`, (err, departments) => {
                prompt({
                    type: 'rawlist',
                    message: 'What is the name of the department?',
                    choices: function () {
                        const dept = [];
                        for (let i = 0; i < departments.length; i++) {
                            dept.push(departments[i].name);
                        }
                        return dept;
                    },
                    name: 'departmentName',
                })
                    .then((response) => {
                        db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, concat(manager.first_name," ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id WHERE department.name = ?', response.departmentName, (err, employees) => {
                            if (!err) {
                                console.table(employees);
                                init();
                            };
                        })
                    });
            });
            break;
        }

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

                    db.query('SELECT id FROM role WHERE ?', { title: response.role }, (err, roleID) => {
                        db.query('SELECT id FROM employee WHERE ? AND ?',
                            [{ first_name: managerName[0] }, { last_name: managerName[1] }], (err, managerID) => {
                                db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [response.first_name, response.last_name, roleID[0].id, managerID[0].id], (err) => {
                                    if (!err) {
                                        init();
                                    }
                                })
                            })
                    })
                });
            break;
        }

        case 'Update Employee Role': {
            db.query(`SELECT CONCAT(first_name," ", last_name) AS name FROM employee`, (err, employees) => {
                db.query(`SELECT * FROM role`, (err, roles) => {
                    prompt([{
                        type: 'rawlist',
                        message: 'Which employee would you like to update?',
                        choices: function () {
                            const employee = [];
                            for (let i = 0; i < employees.length; i++) {
                                employee.push(employees[i].name);
                            }
                            return employee;
                        },
                        name: 'employee',
                    }, {
                        type: 'rawlist',
                        message: 'What is the updated role?',
                        choices: function () {
                            const role = [];
                            for (let i = 0; i < roles.length; i++) {
                                role.push(roles[i].title);
                            }
                            return role;
                        },
                        name: 'role',
                    }])
                        .then((response) => {
                            const employeeName = response.employee.split(" ");

                            db.query('SELECT id FROM role WHERE ?', { title: response.role }, (err, roleID) => {
                                db.query('SELECT id FROM employee WHERE ? AND ?', [{ first_name: employeeName[0] }, { last_name: employeeName[1] }], (err, employeeID) => {
                                    db.query('UPDATE employee SET ? WHERE ?', [{ role_id: roleID[0].id }, { id: employeeID[0].id }], (err) => {
                                        if (!err) {
                                            init();
                                        }
                                    })
                                })
                            })
                        });
                });
            });
            break;
        }

        case 'Update Employee Managers': {
            db.query(`SELECT CONCAT(first_name," ", last_name) AS name FROM employee`, (err, employees) => {
                db.query(`SELECT CONCAT(first_name," ", last_name) AS name FROM employee WHERE manager_id IS NULL`, (err, managers) => {
                    prompt([{
                        type: 'rawlist',
                        message: 'Which employee would you like to update?',
                        choices: function () {
                            const employee = [];
                            for (let i = 0; i < employees.length; i++) {
                                employee.push(employees[i].name);
                            }
                            return employee;
                        },
                        name: 'employee',
                    }, {
                        type: 'rawlist',
                        message: 'Which manager would you like to update to?',
                        choices: function () {
                            const manager = [];
                            for (let i = 0; i < managers.length; i++) {
                                manager.push(managers[i].name);
                            }
                            return manager;
                        },
                        name: 'manager',
                    }])
                        .then((response) => {
                            const employeeName = response.employee.split(" ");
                            const managerName = response.manager.split(" ");

                            db.query('SELECT id FROM employee WHERE ?', [{ first_name: managerName[0] }, { last_name: managerName[1] }], (err, managerID) => {
                                db.query('SELECT id FROM employee WHERE ? AND ?', [{ first_name: employeeName[0] }, { last_name: employeeName[1] }], (err, employeeID) => {
                                    db.query('UPDATE employee SET ? WHERE ?', [{ manager_id: managerID[0].id }, { id: employeeID[0].id }], (err) => {
                                        if (!err) {
                                            init();
                                        }
                                    })
                                })
                            })
                        });
                });
            });
            break;
        }

        case 'Delete Employee': {
            db.query(`SELECT CONCAT(first_name," ", last_name) AS name FROM employee`, (err, employees) => {
                db.query(`SELECT * FROM role`, (err, roles) => {
                    prompt({
                        type: 'rawlist',
                        message: 'Which employee would you like to delete?',
                        choices: function () {
                            const employee = [];
                            for (let i = 0; i < employees.length; i++) {
                                employee.push(employees[i].name);
                            }
                            return employee;
                        },
                        name: 'employee',
                    })
                        .then((response) => {
                            const employeeName = response.employee.split(" ");

                            db.query('SELECT id FROM employee WHERE ? AND ?', [{ first_name: employeeName[0] }, { last_name: employeeName[1] }], (err, employeeID) => {
                                db.query('DELETE FROM employee WHERE ?', { id: employeeID[0].id }, (err) => {
                                    if (!err) {
                                        init();
                                    }
                                })
                            })
                        });
                });
            });
            break;
        }

        case 'View All Roles': {
            db.query(`SELECT role.id, role.title, department.name AS department, role.salary 
            FROM role 
            LEFT JOIN department ON role.department_id = department.id`, (err, roles) => {
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
                });
            break;
        }

        case 'Delete Role': {
            db.query(`SELECT * FROM role`, (err, roles) => {
                prompt({
                    type: 'rawlist',
                    message: 'Which role would you like to delete?',
                    choices: function () {
                        const role = [];
                        for (let i = 0; i < roles.length; i++) {
                            role.push(roles[i].title);
                        }
                        return role;
                    },
                    name: 'roleTitle',
                })
                    .then((response) => {
                        db.query('DELETE FROM role WHERE ?', { title: response.roleTitle }, (err) => {
                            if (!err) {
                                init();
                            };
                        })
                    });
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
                message: 'Which department would you like to delete?',
                name: 'departmentName',
            })
                .then((response) => {
                    db.query(`INSERT INTO department (name) VALUES ('${response.departmentName}')`);
                    init();
                });
            break;
        }

        case 'Delete Department': {
            db.query(`SELECT * FROM department`, (err, departments) => {
                prompt({
                    type: 'rawlist',
                    message: 'What is the name of the department?',
                    choices: function () {
                        const dept = [];
                        for (let i = 0; i < departments.length; i++) {
                            dept.push(departments[i].name);
                        }
                        return dept;
                    },
                    name: 'departmentName',
                })
                    .then((response) => {
                        db.query('DELETE FROM department WHERE ?', { name: response.departmentName }, (err) => {
                            if (!err) {
                                init();
                            };
                        })
                    });
            });
            break;
        }

        case 'View Total Utilized Budget By Department': {
            db.query(`SELECT * FROM department`, (err, departments) => {
                prompt({
                    type: 'rawlist',
                    message: 'Select the department to view the Total Utilized Budget:',
                    choices: function () {
                        const dept = [];
                        for (let i = 0; i < departments.length; i++) {
                            dept.push(departments[i].name);
                        }
                        return dept;
                    },
                    name: 'departmentName',
                })
                    .then((response) => {
                        db.query('SELECT department.name AS department, SUM(role.salary) AS total FROM role LEFT JOIN department ON role.department_id = department.id WHERE department.name = ?', response.departmentName, (err, roles) => {
                            if (!err) {
                                console.table(roles);
                                init();
                            };
                        })
                    });
            });
            break;
        }

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
            'View Employees By Manager',
            'View Employees By Department',
            'Add Employee',
            'Update Employee Role',
            'Update Employee Managers',
            'Delete Employee',
            'View All Roles',
            'Add Role',
            'Delete Role',
            'View All Departments',
            'Add Department',
            'Delete Department',
            'View Total Utilized Budget By Department',
            'Quit',
        ],
        name: 'choices',
    })
        .then((response) => {
            chooseOption(response.choices);
        });
};

init(); 