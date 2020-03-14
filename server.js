const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Functions

function deleteSpace(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "") {
      arr.splice(i, 1);
    }
  }
  console.log(arr);
  return arr;
}

// HTML Routes
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});

// API Routes
app.get("/api/notes", function(req, res) {
  const notes = fs.readFile(
    path.join(__dirname, "./public/assets/db/db.json"),
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
    path.join(__dirname, "./public/assets/db/db.json"),
    "utf8",
    function(err, data) {
      if (err) throw err;
      return data;
    }
  );

  const array2 = dbJSON.split("]");
  console.log(array2);
  array2.splice(1, 0, "]");
  array2.splice(1, 0, noteStr);
  if (array2[0] !== "[") {
    array2.splice(1, 0, ",");
  }
  const newArr = array2.join("");
  const array = newArr.split(",");
  const array0 = deleteSpace(array);
  const array1 = array0.join(",");
  fs.writeFile(
    path.join(__dirname, "./public/assets/db/db.json"),
    array1,
    "utf8",
    function(err, data) {
      if (err) {
        return err;
      }
    }
  );
  return res.json(array1);
});

app.delete("/api/notes/:id", function(req, res) {
  const chosen = req.params.id;
  const string = chosen.toString();
  const dbJSON = fs.readFileSync(
    path.join(__dirname, "./public/assets/db/db.json"),
    "utf8",
    function(err, data) {
      if (err) throw err;
      return data;
    }
  );
  const newArr = dbJSON.split("{");
  console.log(newArr);
  for (let i = 0; i < newArr.length; i++) {
    if (newArr[i].includes(string)) {
      newArr.splice(i, 1);

      // newArr.splice(i - 2, 1);
      if (i === newArr.length) {
        let emptyArr = [];
        for (let j = 0; j < newArr[i - 1].length; j++) {
          emptyArr.push(newArr[i - 1][j]);
        }
        emptyArr.splice(emptyArr.length - 5, 1);
        emptyArr.push("]\r\n");
        const strJoin = emptyArr.join("");
        console.log(strJoin);
        newArr.splice(i - 1, 1);
        newArr.splice(i - 1, 0, strJoin);
      }
    }
  }
  const array = newArr.join("{");
  fs.writeFile(
    path.join(__dirname, "./public/assets/db/db.json"),
    array,
    "utf8",
    function(err, data) {
      if (err) {
        return err;
      }
      console.log(data);
    }
  );
  return res.json(array);
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
