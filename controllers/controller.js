
const {fetchTopics, fetchEndpoints, fetchArticleById, fetchArticles, fetchCommentsByArticleId, insertComment, updateArticle, removeComment} = require("../models/model.js");
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


exports.postComment = (req,res,next) => {
    const article_id = req.params.article_id;
    const commentData = req.body;
    const commentPromises = [checkExists("articles", "article_id", article_id), checkExists("users", "username", commentData.username),insertComment(article_id, commentData)];

    Promise.all(commentPromises)
    .then((resolvedPromises) => {
      const comment = resolvedPromises[2];
      res.status(201).send({ comment });
    })
    .catch(next);

}

exports.patchArticle = (req,res,next) => {
    const article_id = req.params.article_id;
    const data = req.body;
    updateArticle(article_id, data).then((article) => {
        res.status(200).send({article});
    })
    .catch((err) => {
        next(err);
    })

}

exports.deleteComment = (req,res,next) => {
    const comment_id = req.params.comment_id;
    const commentPromises = [checkExists("comments", "comment_id", comment_id), removeComment(comment_id)];
    Promise.all(commentPromises)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}