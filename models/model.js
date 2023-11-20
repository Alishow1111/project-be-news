const db = require("../db/connection.js");

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics").then((result) => {
        return result.rows;
    })
}

exports.fetchArticleById = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then((result) => {
        const article = result.rows[0];
        if (!article){
            return Promise.reject({
                status: 404,
                msg: `article_id doesnt exist`,
            })
        }else{
            return article;
        }
    })
}