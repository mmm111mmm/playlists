function isLoggedIn(req, res, next) {
  if (req.session && req.session.user && req.session.user._id) next()
  else res.status(403).send("Unauthorized")
}

module.exports = { isLoggedIn }