const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("/api/notes", function(req, res) {
  const notes = fs.readFile(
    path.join(__dirname, "./assets/db/db.json"),
    "utf8",
    (err, data) => {
      if (err) {
        return err;
      }
      console.log(data);
      return data;
    }
  );
  return res.json(notes);
});

app.post("/api/notes", function(req, res) {
  const newNote = req.body;
  const noteStr = JSON.stringify(newNote);
  const dbJSON = fs.readFileSync(
    path.join(__dirname, "./assets/db/db.json"),
    "utf8",
    function(err, data) {
      if (err) throw err;
      return data;
    }
  );
  const array = dbJSON.split("*");
  array.splice(1, 0, "*");
  array.splice(1, 0, noteStr);
  array.splice(1, 0, ",");
  const newArr = array.join("");
  console.log(newArr);
  fs.writeFile(
    path.join(__dirname, "./assets/db/db.json"),
    newArr,
    "utf8",
    function(err, data) {
      if (err) {
        return err;
      }
      console.log(data);
    }
  );
  return res.end();
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
