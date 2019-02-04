const express = require("express");
const exphbs = require("express-handlebars");

const { mongoose } = require("./db/mongoose");

const app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", { title });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
