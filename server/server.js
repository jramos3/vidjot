const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { body, validationResult } = require("express-validator/check");

const { mongoose } = require("./db/mongoose");
const { Idea } = require("./models/Idea");

const app = express();

//body-parse middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//method-override middleware
app.use(methodOverride("_method"));

//handlebars middleware
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

//GET /ideas/edit/:id
app.get("/ideas/edit/:id", (req, res) => {
  const { id } = req.params;

  Idea.findById(id)
    .then(idea => {
      res.render("ideas/edit", { idea });
    })
    .catch(err => res.status(400));
});

//POST /ideas
app.post(
  "/ideas",
  [
    body("title", "Please add a title.")
      .trim()
      .isLength({ min: 1 }),
    body("details", "Please add some details.")
      .trim()
      .isLength({ min: 1 })
  ],
  (req, res) => {
    const errors = validationResult(req).array();

    if (errors.length) {
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
  }
);

//PUT /idea/:id
app.put(
  "/ideas/:id",
  [
    body("title", "Please add a title.")
      .trim()
      .isLength({ min: 1 }),
    body("details", "Please add some details.")
      .trim()
      .isLength({ min: 1 })
  ],
  (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req).array();

    if (errors.length) {
      res.render("ideas/edit", {
        errors,
        idea: {
          _id: id,
          title: req.body.title,
          details: req.body.details
        }
      });
    } else {
      const updatedIdea = {
        title: req.body.title,
        details: req.body.details
      };

      Idea.findByIdAndUpdate(id, { $set: updatedIdea }, { new: true })
        .then(idea => {
          res.redirect("/ideas");
        })
        .catch(err => res.status(400));
    }
  }
);

//DELETE /ideas/:id
app.delete("/ideas/:id", (req, res) => {
  const { id } = req.params;

  Idea.findByIdAndDelete(id)
    .then(idea => {
      res.redirect("/ideas");
    })
    .catch(err => res.status(400));
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
