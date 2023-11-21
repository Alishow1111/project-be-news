exports.handlePsqlErrors = (err, req, res, next) => {

    if (err.code){
        res.status(400).send({ msg: 'Invalid Param' });
    }
    else{
        next(err);
    }

};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
};
