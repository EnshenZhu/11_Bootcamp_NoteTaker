const fs = require('fs');
const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

// add middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Display the task
const taskDisplay = (res) => {
    const data = readFromDB();
    res.send(data);
};
 
 // Save the task
const saveTask = (body, res) => {
    const data = readFromDB();
    data.push(body);
    writeToDB(data, res);
};

// Arrange an ID to the task
function addId(data) {
    let id = 1;
    data.forEach(element => {
        element["id"] = id++;
    });
    return data;
};
 
// Read data from the database
function readFromDB() {
    let data = fs.readFileSync('./db/db.json', 'utf-8');
    return data = JSON.parse(data);
};
 
// Write data to the database
function writeToDB(data, res) {
    data = JSON.stringify(addId(data));
    fs.writeFileSync("./db/db.json", data, function (err) {
        (err ? res.send('Error! The note has not been saved properly') : res.send('Your note has been saved successfully')); // identify if the new data has been sucessfully write into the database
    });
};

// Delete the task
function removeTask(id, res) {
    const data = readFromDB();
    const newData = data.filter(function callback(item) {
        if (item.id != id) {
            return true;
        } else {
            return false;
        }
    });
    writeToDB(newData, res);
};

// create all the routes
// visit the index page
app.get('/*/', (req, res) => {
    res.redirect('/index.html')
})

// visit the notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, '/notes.html'))
});

app.delete('/api/notes/:id', (req, res) => {
    removeTask(req.params.id, res)
});

app.route('/api/notes')
.get((req, res) => taskDisplay(res))
.post((req, res) =>  saveTask(req.body, res));

//listen to the port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
});