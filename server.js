const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001; //the first option is to dynamically find the right port on Heroku, the second is for locally running the app
const db = require("./db/db.json")
const app = express(); //instance of express
const uuid = require('./helpers/uuid.js');
const fs = require("fs");


//middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//HTML Routes
//GET /notes route to retrieve saved notes from db.json //send them to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});


//API Notes
//* `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        console.log(JSON.parse(data))
        res.json(JSON.parse(data))
    });
});

//* `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post('/api/notes', (req, res) => {
    console.log(req.body);
    const { title, text } = req.body;
    if (req.body) {
        const newNote = {
            title: title,
            text: text,
            id: uuid(),
        };
        fs.readFile("./db/db.json", (err, data) => {
            let newArr = JSON.parse(data);
            newArr.push(newNote)
            console.log(`new arr: ${JSON.stringify(newArr)}`)
            fs.writeFile('./db/db.json', JSON.stringify(newArr), (err) => {
                err ? res.status(500) : res.json('Note added successfully');
            })
        });
    }
    else {
        res.status(500);
    }
});


//DELETE /api/notes
app.delete('/api/notes/:id', (req, res) => {


    //read the db.json file and re-write it to include everything EXCEPT the one we want to delete
    fs.readFile("./db/db.json", (err, data) => {
        let updatedNotes = JSON.parse(data).filter((note) => {
            console.log(note);
            return note.id != req.params.id
        })
        console.log(JSON.stringify(updatedNotes));
        console.log(req.params.id);
        console.log(JSON.stringify(updatedNotes));
        fs.writeFile("./db/db.json", JSON.stringify(updatedNotes), (err) => { if (err) { res.status(500) } res.json({ ok: true }) });
        ;
    });

});

//Another HTML route
// GET * Route for homepage
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//Log to the console when the sever is running
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));