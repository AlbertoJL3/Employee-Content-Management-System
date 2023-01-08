const express = require('express');
const table = require('console.table');
// Import and require mysql2
const mysql = require('mysql2');
const fs = require('fs');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;
const app = express();

//Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        password: 'crunchyroll',
        database: 'company_db'
    },
    console.log(`Connected to the employee database.`)
);

async function main() {

    // Show the main menu
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                '',
            ],
        },
    ]);

    switch (answer.option) {
        case 'View all departments':
            viewDepartments(db);
            break;
        case 'View all roles':
            viewRoles(db);
            break;
        case 'View all employees':
            viewEmployees(db);
            break;
        case 'Add a department':
            addDepartment(db);
            break;
        case 'Add a role':
            addRole(db);
            break;
        case 'Add an employee':
            addEmployee(db);
            break;
        case 'Update an employee role':
            updateEmployeeRole(db);
            break;
    }

}

// View all departments
async function viewDepartments(connection) {
    try {
        const params = [];
        const sql = 'SELECT id, name FROM department ORDER BY id;'
        // Retrieve the list of employees from the database
        connection.query(sql, params, (err, result) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            console.table(result)
        }
        );
    } catch (error) {
        console.error(error);
    } finally {
        // Return to the main menu
        main();
    }
}

// View all roles
async function viewRoles(connection) {
    // Replace this with your code to retrieve a list of roles from the database
    try {
        const params = [];
        const sql = `SELECT r.id, r.title, d.name as department, r.salary
        FROM role r
        INNER JOIN department d ON r.department_id = d.id;`
        // Retrieve the list of employees from the database
        connection.query(sql, params, (err, result) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            console.table(result)
        }
        );
    } catch (error) {
        console.error(error);
    } finally {
        // Return to the main menu
        main();
    }
}

// View all employees
// View all employees
async function viewEmployees(connection) {
    try {
        const params = [];
        const sql = 'SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id'
        // Retrieve the list of employees from the database
        connection.query(sql, params, (err, result) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            console.table(result)
        }
        );
    } catch (error) {
        console.error(error);
    } finally {
        // Return to the main menu
        main();
    }
}

// Add a department
async function addDepartment(connection) {
    try {
        // Prompt the user to enter the name of the department
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Enter the name of the department:',
            },
        ]);

        // Add the department to the database
        const params = []
        const departmentName = answer.departmentName
        const sql = 'INSERT INTO department (name) VALUES ("' + departmentName + '")';
        // Retrieve the list of employees from the database
        connection.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                return;
            }
            console.log(`Department ${departmentName} was added to the database.`);
            main();
        }
        );
    } catch (error) {
        console.error(error);
    }
}

// Add a role
async function addRole(connection) {
    try {
        // Retrieve the list of departments from the database
        const sql = 'SELECT name FROM department';
        connection.query(sql, (err, rows) => {
            if (err) {
                console.log(err)
                return;
            }

            // Extract the department names from the rows
            const departments = rows.map(row => row.name);

            // Prompt the user to enter the role details
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the title of the role:',
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the salary for the role:',
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select the department for the role:',
                    choices: departments,
                },
            ]).then(answer => {
                // Add the role to the database
                const params = []
                const title = answer.title
                const salary = answer.salary
                const department = answer.department
                const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, (SELECT id FROM department WHERE name = ?))';
                connection.query(sql, [title, salary, department], (err, result) => {
                    if (err) {
                        console.log(err)
                        return;
                    }
                    console.log(
                        `Added role: ${title} (${department}, $${salary})`
                    );
                    main();
                });
            });
        });
    } catch (error) {
        console.error(error);
    }
}

// Add an employee
async function addEmployee(connection) {
    try {
        // Retrieve the list of roles and employees from the database
        const roleSql = 'SELECT id, title FROM role';
        const employeeSql = 'SELECT id, first_name, last_name FROM employee';
        connection.query(roleSql, (err, roleRows) => {
            if (err) {
                console.log(err)
                return;
            }
            connection.query(employeeSql, (err, employeeRows) => {
                if (err) {
                    console.log(err)
                    return;
                }

                // Extract the role titles and employee names from the rows
                const roles = roleRows.map(row => ({
                    name: row.title,
                    value: row.id,
                }));
                const employees = employeeRows.map(row => ({
                    name: `${row.first_name} ${row.last_name}`,
                    value: row.id,
                }));

                // Prompt the user to enter the employee details
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'Enter the first name of the employee:',
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'Enter the last name of the employee:',
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Select the role for the employee:',
                        choices: roles,
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Select the manager for the employee:',
                        choices: ['None'].concat(employees),
                    },
                ]).then(answer => {
                    // Add the employee to the database
                    const params = []
                    const firstName = answer.firstName
                    const lastName = answer.lastName
                    const role = answer.role
                    let manager = null
                    if (answer.manager !== 'None') {
                        manager = answer.manager
                    }
                    const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                    connection.query(sql, [firstName, lastName, role, manager], (err, result) => {
                        if (err) {
                            console.log(err)
                            return;
                        }
                        console.log(
                            `Added employee: ${firstName} ${lastName} (Role ID: ${role}, Manager ID: ${manager})`
                        );
                        main();
                    });
                });
            });
        });
    } catch (error) {
        console.error(error);
    }
}

// Start the application
main();

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
