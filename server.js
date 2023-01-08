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
        // TODO: Add MySQL password here
        password: 'crunchyroll',
        database: 'company_db'
    },
    console.log(`Connected to the employee database.`)
);

async function main() {
    const db = mysql.createConnection(
        {
            host: 'localhost',
            // MySQL username,
            user: 'root',
            // TODO: Add MySQL password here
            password: 'crunchyroll',
            database: 'company_db'
        },
        console.log(`Connected to the employee database.`)
    );
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


// Start the application
main();
// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

//View All Departments - Simple Inquirer prompt that allows user to pick:
//View ALL Departments
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
//View ALL roles
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
//View ALL employess
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
//Add a department
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
//Add a role
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
//Add an employee
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
//update an employee role
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database


// Make the routes Asynchronous 

// department
// id: INT PRIMARY KEY
// name: VARCHAR(30) to hold department name

// role
// id: INT PRIMARY KEY
// title: VARCHAR(30) to hold role title
// salary: DECIMAL to hold role salary
// department_id: INT to hold reference to department role belongs to

// employee
// id: INT PRIMARY KEY
// first_name: VARCHAR(30) to hold employee first name
// last_name: VARCHAR(30) to hold employee last name
// role_id: INT to hold reference to employee role
// manager_id: INT to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
