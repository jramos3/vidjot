const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const { Idea } = require("./models/Idea");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//GET /
app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", { title });
});

//GET /about
app.get("/about", (req, res) => {
  res.render("about");
});

//GET /ideas/add
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

//GET /ideas
app.get("/ideas", (req, res) => {
  Idea.find()
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", { ideas });
    })
    .catch(err => res.status(400));
});

//POST /ideas
app.post("/ideas", (req, res) => {
  const errors = [];

  if (!req.body.title) {
    errors.push({ errorMessage: "Please add a title." });
  }

  if (!req.body.details) {
    errors.push({ errorMessage: "Please add some details." });
  }

  if (errors.length > 0) {
    res.render("ideas/add", {
      errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newIdea = {
      title: req.body.title,
      details: req.body.details
    };

    new Idea(newIdea)
      .save()
      .then(idea => {
        res.redirect("/ideas");
      })
      .catch(err => res.status(400));
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
