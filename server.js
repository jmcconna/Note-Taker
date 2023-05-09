const express = require('express');
const PORT = process.env.PORT || 3001; //the first option is to dynamically find the right port on Heroku, the second is for locally running the app
const db = require("./db/db.json")
const app = express(); //instance of express
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const path = require("path");

//middleware
app.use(express.static('public'));

//HTML Routes
//GET /notes route to retrieve saved notes from db.json //send them to notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});


//API Notes
//* `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
app.get("api/notes", (req, res) => {
     readFromFile(db).then((data) => res.json(JSON.parse(data)));
});

//* `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post("api/notes", (req, res) => {
    console.log(req.body);
    const {title, text} = req.body

});

//Another HTML route
// GET * Route for homepage
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//Log to the console when the sever is running
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));