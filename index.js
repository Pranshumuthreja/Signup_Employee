const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const dataFilePath = path.join(__dirname, 'data.json');

// Check if data.json exists, and if not, create it with an empty array
function initializeDataFile() {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, '[]', 'utf8');
    }
}

// Read employee data from data.json
function readData() {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
}

// Write employee data to data.json
function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// Serve the HTML file
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Employee Signup</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f4f7;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }

                .signup-container {
                    background-color: #fff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 500px;
                    text-align: center;
                }

                h1 {
                    font-size: 24px;
                    margin-bottom: 20px;
                    color: #333;
                }

                form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                input[type="text"], input[type="number"], input[type="submit"] {
                    padding: 10px;
                    font-size: 16px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    width: 100%;
                    box-sizing: border-box;
                }

                input[type="submit"] {
                    background-color: #4CAF50;
                    color: white;
                    cursor: pointer;
                    border: none;
                }

                input[type="submit"]:hover {
                    background-color: #45a049;
                }

                .signup-container p {
                    font-size: 14px;
                    color: #777;
                }

                .back-link {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #4CAF50;
                    text-decoration: none;
                }

                .back-link:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="signup-container">
                <h1>Employee Signup</h1>
                <form action="/addEmployee" method="POST">
                    <input type="text" name="id" placeholder="Employee ID" required>
                    <input type="text" name="name" placeholder="Full Name" required>
                    <input type="text" name="designation" placeholder="Designation" required>
                    <input type="text" name="contact" placeholder="Contact Number" required>
                    <input type="number" name="salary" placeholder="Salary" required>
                    <input type="submit" value="Sign Up">
                </form>
                <p>Already registered? <a class="back-link" href="/getEmployee">View your details</a></p>
            </div>
        </body>
        </html>
    `);
});

// Handle form submission to add an employee
app.post('/addEmployee', (req, res) => {
    initializeDataFile(); // Ensure the data.json file is created
    const { id, name, designation, contact, salary } = req.body;
    let employees = readData();

    const newEmployee = { id, name, designation, contact, salary };
    employees.push(newEmployee);

    writeData(employees);
    res.send(`Employee ${name} added successfully!`);
});

// Handle fetching employee details by ID
app.get('/getEmployee', (req, res) => {
    initializeDataFile(); // Ensure the data.json file is created
    const { id } = req.query;
    const employees = readData();

    const employee = employees.find(emp => emp.id === id);

    if (employee) {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Employee Details</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }

                    .container {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        width: 100%;
                        max-width: 600px;
                    }

                    h1 {
                        text-align: center;
                        color: #4CAF50;
                        margin-bottom: 20px;
                    }

                    .employee-details {
                        background-color: #e8f5e9;
                        padding: 15px;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }

                    .employee-details h2 {
                        margin-top: 0;
                        color: #2e7d32;
                    }

                    .employee-details p {
                        margin: 5px 0;
                    }

                    a {
                        display: block;
                        margin-top: 20px;
                        text-align: center;
                        color: #4CAF50;
                        text-decoration: none;
                        font-weight: bold;
                    }

                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Employee Details</h1>
                    <div class="employee-details">
                        <h2>${employee.name}</h2>
                        <p><strong>ID:</strong> ${employee.id}</p>
                        <p><strong>Designation:</strong> ${employee.designation}</p>
                        <p><strong>Contact:</strong> ${employee.contact}</p>
                        <p><strong>Salary:</strong> $${employee.salary}</p>
                    </div>
                    <a href="/">Go Back</a>
                </div>
            </body>
            </html>
        `);
    } else {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Employee Not Found</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }

                    .container {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        width: 100%;
                        max-width: 600px;
                    }

                    h1 {
                        text-align: center;
                        color: #f44336;
                        margin-bottom: 20px;
                    }

                    p {
                        text-align: center;
                        color: #333;
                    }

                    a {
                        display: block;
                        margin-top: 20px;
                        text-align: center;
                        color: #4CAF50;
                        text-decoration: none;
                        font-weight: bold;
                    }

                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Employee Not Found</h1>
                    <p>No employee with ID ${id} was found.</p>
                    <a href="/">Go Back</a>
                </div>
            </body>
            </html>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
