const fs = require('fs');
const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

// add middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// display tasks
function taskDisplay(res) {
    const data = readFromDB();
    res.send(data);
}

// save tasks
function taskSave(body, res) {
    const data = readFromDB();
    data.push(body);
    writeToDB(data, res);
}

// delete tasks
function taskRemove(id, res) {
    const data = readFromDB();
    const newData = data.filter((item) => {
            if (item.id != id) {
                return true;
            } else {
                return false;
            }
        });
    writeToDB(newData, res);
}
 
// read from the database
function readFromDB() {
    let data = fs.readFileSync('./db/db.json', 'utf-8');
    return data = JSON.parse(data);
}
 
// write to the database
function writeToDB(data, res) {
    data = addId(data);
    data = JSON.stringify(data);
    fs.writeFile("./db/db.json", data, function (err) {
        (err ? res.send('Error, the note is not properly saved!') : res.send('The note is saved successfully!'));
    });
}
 
//Function used to add IDs to the tasks.
function addId(data) {
    let id = 1;
    //console.log(data);
    data.forEach(element => {
        element["id"] = id++;
    });
    return data;
}

// add all route callings

// visit the landing page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// visit the notes
app.route('/api/notes')
.get((req, res) => {
    taskDisplay(res)
})

// post the notes
app.route('/api/notes')
.post((req, res) =>{
    taskSave(req.body, res)
});

// delete the notes
app.delete('/api/notes/:id', (req, res) => {
    taskRemove(req.params.id, res)
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//listen to the port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
});