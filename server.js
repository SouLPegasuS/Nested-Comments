require('dotenv').config({path: "./.env"});
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const PORT = process.env.PORT || 4000;
app.use(express.json());

const DB = process.env.DATABASE;
mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}).then(() => {
    console.log("connection successful");
}).catch((err) => console.log(err));



if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", function(req, res) {
      res.sendFile(path.resolve(__dirname,"client","build","index.html"));  
  });
}

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
