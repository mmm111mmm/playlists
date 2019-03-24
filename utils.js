function makeError(status, text) {
  var error = new Error(text)
  error.status = status
  return error
}

// Used in routes as middleware to check if the user is 
// logged on or not. If not, send the user a 403.
function isLoggedIn(req, res, next) {
  if (req.session && req.session.user && req.session.user._id) next()
  else next(makeError(403, "Unauthorized"))
}

// Middleware that checks if the correct
// body params are passed int o a route.
// Gives the user a 400 error with the errors 
// if the body parameters are missing or an empty string
function requireParams(bodyParams) {
  return function(req, res, next) {
    var errors = []
    bodyParams.forEach(function(param) {
      var p = req.body[param]
      if(!p || (p && typeof p === 'string' && p.trim().length == 0)) {
        errors.push({
          field: param,
          message: `${param} is required and cannot be blank`
        })
      }
    })
    if(errors.length > 0) {
      res.status(400).json(errors)
    } else {
      next()
    }
  }
}

module.exports = { isLoggedIn, makeError, requireParams }