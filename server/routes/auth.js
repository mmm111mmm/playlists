const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { User } = require('./../models.js')
// * isLoggedIn - middleware to check the user is logged
// * makeError - creates an error with a HTTP response code
// that's sent to next() which is our error handler in server.js
// * requireParams - ensure the request has the right body params
const { isLoggedIn, requireParams } = require('./../utils.js')

router.post("/auth/signup", 
  requireParams(["username", "password"]), 
  function(req, res, next) {

    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(req.body.password, salt);
    var user = {
      username: req.body.username, 
      password: encryptedPassword
    }
    User.create(user)
    .then(function() {
      res.status(200).send()
    })
    .catch(function(error) {
      next(error)
    })    

});

router.post("/auth/login", 
  requireParams(["username", "password"]), 
  function(request, response, next) {

    User.findOne({username: request.body.username})
    .then(function(user) {
      if(user == null) {
        response.status(404).send()
      } else {  
        if(bcrypt.compareSync(request.body.password, user.password)) {
          request.session.user = user
          response.status(200).send(user)
        } else {
          response.status(404).send()
        }
      }
    })
    .catch(function(error) {
      next(error)
    })

});

router.post('/auth/logout', 
  function(request, response, next) { 

    request.session.destroy(function(error) {
      if(error) console.log("Couldn't destroy the sesson")
    })
    response.status(200).send()

  }
);

router.get('/auth/profile', 
  isLoggedIn, 
  function(req, res, next) { 

    res.status(200).send(req.session.user)

  }
);

module.exports = router;
