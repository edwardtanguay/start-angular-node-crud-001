const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'employees.json');

app.use(cors());
app.use(bodyParser.json());

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Helper to read data
const readData = () => {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// GET all employees
app.get('/api/employees', (req, res) => {
    const employees = readData();
    res.json(employees);
});

// GET employee by ID
app.get('/api/employees/:id', (req, res) => {
    const employees = readData();
    const employee = employees.find(e => e.id === req.params.id);
    if (employee) {
        res.json(employee);
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
});

// POST create employee
app.post('/api/employees', (req, res) => {
    const employees = readData();
    const newEmployee = {
        id: Date.now().toString(), // Simple ID generation
        ...req.body
    };
    employees.push(newEmployee);
    writeData(employees);
    res.status(201).json(newEmployee);
});

// PUT update employee
app.put('/api/employees/:id', (req, res) => {
    const employees = readData();
    const index = employees.findIndex(e => e.id === req.params.id);
    if (index !== -1) {
        employees[index] = { ...employees[index], ...req.body, id: req.params.id };
        writeData(employees);
        res.json(employees[index]);
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
});

// DELETE employee
app.delete('/api/employees/:id', (req, res) => {
    let employees = readData();
    const initialLength = employees.length;
    employees = employees.filter(e => e.id !== req.params.id);
    if (employees.length < initialLength) {
        writeData(employees);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
