const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path")
const cors = require("cors")

const app = express();
const port = 3000
app.use(bodyParser.json());
app.use(cors());

let todos = [];

function findIndex(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) return i;
    }
    return -1;
}

function removeAtIndex(arr, index) {
    let newArray = [];
    for (let i = 0; i < arr.length; i++) {
        if (i !== index) newArray.push(arr[i]);
    }
    return newArray;
}

app.get('/todos', (req, res) => {

    fs.readFile('todos.json', 'utf-8', (err, data) => {
        res.json(JSON.parse(data));
    })

});

app.get('/todos/:id', (req, res) => {
    fs.readFile('todos.json', 'utf-8', (err, data) => {
        const todoList = JSON.parse(data)
        const todoIndex = findIndex(todoList, parseInt(req.params.id));
        if (todoIndex === -1) {
            res.status(404).send();
        } else {
            res.json(todoList[todoIndex]);
        }
    })
});

app.post('/todos', (req, res) => {
    const newTodo = {
        id: Math.floor(Math.random() * 1000000), // unique random id
        title: req.body.title,
        description: req.body.description
    };
    fs.readFile('todos.json', 'utf-8', (err, data) => {
        const todos = JSON.parse(data)
        todos.push(newTodo)
        fs.writeFile('todos.json', JSON.stringify(todos), (err) => {
            if (err) throw err;
            res.status(201).json(todos)
        })

    })

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
    fs.readFile('todos.json', 'utf-8', (err, data) => {
        let todoList = JSON.parse(data)
        const todoIndex = findIndex(todoList, parseInt(req.params.id));
        if (todoIndex === -1) {
            res.status(404).send();
        } else {
            todoList[todoIndex].title = req.body.title;
            todoList[todoIndex].description = req.body.description;
            fs.writeFile('todos.json', JSON.stringify(todoList), (err) => {
                if (err) throw err;
                res.json(todoList[todoIndex]);
            })

        }
    })

});

app.delete('/todos/:id', (req, res) => {

    fs.readFile('todos.json', 'utf-8', (err, data) => {
        let todoList = JSON.parse(data)
        const todoIndex = findIndex(todoList, parseInt(req.params.id));
        if (todoIndex === -1) {
            res.status(404).send();
        } else {
            todoList = removeAtIndex(todoList, todoIndex);
            res.status(200).send();
        }
        fs.writeFile('todos.json', JSON.stringify(todoList), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('File written successfully.');
            }
        })

    })


});

// for all other routes, return 404

const started = () => {
    console.log("App is Listening" + port)
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"))
})
app.listen(port, started)






