const express = require("express");
const app = express();
const {getTopics} = require("./controllers/controller.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.all("*", (req,res) => {
    return res.status(404).send({msg:"Not Found!"});
})

module.exports = app;