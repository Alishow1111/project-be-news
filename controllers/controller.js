const {fetchTopics, fetchEndpoints} = require("../models/model.js");

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
        console.log(endpoints);
        res.status(200).send(endpoints);
    })
    .catch((err) => {
        console.log(err);
        next(err);
    })
}