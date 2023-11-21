const {fetchTopics, fetchEndpoints, fetchArticleById, fetchArticles, insertComment} = require("../models/model.js");
const {checkExists} = require('./utils.js');
exports.getTopics = (req,res,next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    })
    .catch((err) => {
        next(err);
    })
}

exports.getEndpoints = (req,res,next) => {
    fetchEndpoints().then((endpoints) => {
        res.status(200).send({endpoints_info: endpoints});
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

exports.getArticles = (req,res,next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({articles});
    })
    .catch((err) => {
        next(err);
    })
}

exports.postComment = (req,res,next) => {
    const article_id = req.params.article_id;
    const commentData = req.body;
    const commentPromises = [insertComment(article_id, commentData), checkExists("articles", "article_id", article_id)];

    Promise.all(commentPromises)
    .then((resolvedPromises) => {
      const comment = resolvedPromises[0];
      res.status(201).send({ comment });
    })
    .catch(next);
}