require('dotenv').config({path: "./.env"});
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user-routes");
// const commentRoutes = require("./routes/comment-routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

const DB = process.env.DATABASE;
mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}).then(() => {
    console.log("connection successful");
}).catch((err) => console.log(err));

app.use("/users", userRoutes);
// app.use("/comment", commentRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", function(req, res) {
        res.sendFile(path.resolve(__dirname,"client","build","index.html"));  
    });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
