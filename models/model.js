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
