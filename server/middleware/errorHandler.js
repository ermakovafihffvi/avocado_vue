export const errorHandler = (err, req, res, next) => {
    let status = 400;
    let message = process.env.NODE_ENV === 'production' ? 'internal error occured' : err.message;
    if (err.name == 'SequelizeValidationError') {
        status = 422;
        message = err.message;
        //TO DO - handle errors of each error item
    }
    if (process.env.NODE_ENV === 'development') {
        console.log(err);
    }
    res.status(status).send({message: message});
};
