const express = require("express");
const app = express();

const {getTopics, getEndpoints, getArticleById} = require("./controllers/controller.js");
const {handleCustomErrors, handlePsqlErrors} = require("./error_handlers/errors.js");


app.use(express.json());

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById)

app.all("*", (req,res) => {
    return res.status(404).send({msg:"Not Found!"});
})

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;