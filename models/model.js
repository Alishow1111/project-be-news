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