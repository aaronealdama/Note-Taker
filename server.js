/* HTML routes: 
/notes = notes.html
* = index.html

API routes:
GET - /api/notes = read db.json and return all saved notes as JSON
POST - /api/notes = receive a new note to save on req body, add it to the db.json and return the new note to the client

DELETE - /api/notes/:id = Should recieve a query param containing the id of the note to delete
*/

// Packages
const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});

// API routes

app.get("/api/notes", function(req, res) {
  const db = fs.readFile(path.join(__dirname, "db.json"));

  res.json(db);
});

app.post("/api/notes", function(req, res) {
  const newNote = req.body;
  const dbJSON = fs.readFile(path.join(__dirname, "db.json"));
  const array = dbJSON.split("*");
  array.splice(1, 0, "*");
  array.splice(1, 0, newNote);
  const newArr = array.join("");
  fs.writeFile(path.join(__dirname, "db.son"), newArr);
  return res.json(newNote);
});

app.listen(PORT, function() {
  console.log(`App listening on PORT ${PORT}`);
});
