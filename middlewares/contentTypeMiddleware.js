exports.contentTypeApplicationJson = (req, res, next) => {
    //if(req.is('*/json'))
    if(req.get('Content-Type') === "application/json"){
        next()
    }else {
        return res.status(400).json({status: 400, message: "Incorrect Content-Type"})
    }
}
