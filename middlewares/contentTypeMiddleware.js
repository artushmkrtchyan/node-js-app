exports.contentTypeApplicationJson = (req, res, next) => {
    //if(req.is('*/json'))
    if (req.get('Content-Type') === 'application/json') {
        next();
    } else {
        return res
            .status(400)
            .json({ status: 400, message: 'Incorrect Content-Type' });
    }
};

exports.contentTypeFormData = (req, res, next) => {
    if (req.get('Accept') === 'multipart/form-data') {
        next();
    } else {
        return res
            .status(400)
            .json({ status: 400, message: 'Incorrect header. Content-Type: "", Accept: multipart/form-data' });
    }
};
