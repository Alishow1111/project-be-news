const {fetchTopics, fetchArticleById} = require("../models/model.js");

exports.getTopics = (req,res,next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    })
    .catch((err) => {
        next(err);
    })
}

exports.getArticleById = (req,res,next) => {
    const article_id = req.params.article_id;
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article});
    })
    .catch((err) => {
        next(err);
    });
}