const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/Vidjot-dev", {
    useNewUrlParser: true
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

module.exports = { mongoose };
