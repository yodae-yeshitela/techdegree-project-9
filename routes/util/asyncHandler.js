const createError = require('http-errors')

module.exports = function (cb){
    return (req, res, next) => {
      Promise.resolve(cb(req,res,next))
              .catch( () => next(createError(500)))
    }
  }