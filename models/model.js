const db = require("../db/connection.js");
const fs = require('fs/promises')

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics").then((result) => {
        return result.rows;
    })
}

exports.fetchEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`).then((result) => {
        const endpointObject = JSON.parse(result);
        return endpointObject;
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

exports.fetchArticles = () => {

    const query = "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, count(comments.article_id) as comment_count from articles left join comments on (articles.article_id = comments.article_id) GROUP BY articles.article_id ORDER BY articles.created_at DESC;"

    return db.query(query).then((result) => {
        return result.rows;
    })
}

exports.insertComment = (article_id, commentData) => {
    const currentDate = new Date(Date.now());
    const dataArray = [commentData.body, article_id, commentData.username, 0, currentDate]
    if (!Object.keys(commentData).length){
        return Promise.reject({ status: 400, msg: "no request body" });
    }
    return db.query("INSERT INTO comments (body, article_id, author, votes, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;",dataArray).then((result) => {
        return result.rows[0];
    })
}
