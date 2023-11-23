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

exports.fetchArticles = (topic) => {

    if (!topic){
        const query = "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, count(comments.article_id) as comment_count from articles left join comments on (articles.article_id = comments.article_id) GROUP BY articles.article_id ORDER BY articles.created_at DESC;"
        return db.query(query).then((result) => {
            return result.rows;
        })
    }

    
    return db.query("SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, count(comments.article_id) as comment_count from articles left join comments on (articles.article_id = comments.article_id) WHERE topic=$1 GROUP BY articles.article_id ORDER BY articles.created_at DESC;", [topic]).then((result) => {
        if (!result.rows.length){
            return Promise.reject({ status: 400, msg: "topic doesnt exist" });
        }
        return result.rows;
    })


}

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query("SELECT * FROM comments WHERE article_id = $1", [article_id]).then((result) => {
        return result.rows;
    })
}

exports.insertComment = (article_id, commentData) => {
    const currentDate = new Date(Date.now());
    const dataArray = [commentData.body, article_id, commentData.username, 0, currentDate]
    if (Object.keys(commentData).length !== 2){
        return Promise.reject({ status: 400, msg: "invalid request body" });
    }
    return db.query("INSERT INTO comments (body, article_id, author, votes, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;",dataArray).then((result) => {
        return result.rows[0];
    })
}

exports.removeComment = (comment_id) => {
    return db.query("DELETE FROM comments WHERE comment_id = $1;",[comment_id])
}


exports.updateArticle = (article_id, data) => {
    return db.query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;", [article_id, data.inc_votes]).then((result) => {
        if (!result.rows.length){
            if (!data.inc_votes){
                return Promise.reject({status: 400, msg: 'no data in body'}) 
            }

            return Promise.reject({status: 404, msg: 'article_id doesnt exist'})
        }
        else{
            return result.rows[0];
        }
    });
}

exports.fetchUsers = () => {
    return db.query("SELECT * FROM Users;").then((result) => {
        return result.rows;
    })
}





