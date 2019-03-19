// Used in routes as middleware to check if the user is 
// logged on or not. If not, send the user a 403.
function isLoggedIn(req, res, next) {
  if (req.session && req.session.user && req.session.user._id) next()
  else res.status(403).send("Unauthorized")
}

module.exports = { isLoggedIn }