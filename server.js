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
 }
 
 // Save the task
const saveTask = (body, res) => {
    const data = readFromDB();
    data.push(body);
    writeToDB(data, res);
}

 
// Read data from the database
function readFromDB() {
    let data = fs.readFileSync('./db/db.json', 'utf-8');
    return data = JSON.parse(data);
}
 
 // Write data to the database
function writeToDB(data, res) {
    data = JSON.stringify(addId(data));
    fs.writeFile("./db/db.json", data, function (err) {
        (err ? res.send('Something went wrong!') : res.send('Task was successfully saved!'));
    });
}

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
}
 
//Function used to add IDs to the tasks.
function addId(data) {
    var id = 1;
    //console.log(data);
    data.forEach(element => {
        element["id"] = id++;
    });
    return data;
}

app.get('/*/', (req, res) => {
    res.redirect('/index.html')
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.route('/api/notes')
.get((req, res) => {
    taskDisplay(res)
})
.post((req, res) => {
    saveTask(req.body, res)
});

app.delete('/api/notes/:id', (req, res) => {
    removeTask(req.params.id, res)
});

//listen to the port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
});