
const {fetchTopics, fetchEndpoints, fetchArticleById, fetchArticles, fetchCommentsByArticleId} = require("../models/model.js");
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


exports.getCommentsByArticleId = (req,res,next) => {
    const article_id = req.params.article_id;

    const commentPromises = [fetchCommentsByArticleId(article_id), checkExists("articles", "article_id", article_id)];
    Promise.all(commentPromises).then((resolvedPromises) => {
        const comments = resolvedPromises[0];
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.getArticles = (req,res,next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({articles});
    })
    .catch((err) => {
        next(err);
    })

}