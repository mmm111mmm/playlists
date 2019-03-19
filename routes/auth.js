const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { User } = require('./../models.js')
// middleware to check the user is logged
const { isLoggedIn } = require('./../utils.js')

router.post("/auth/signup", function(request, response, next) {
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(request.body.password, salt);
    var user = {
        username: request.body.username, 
        password: encryptedPassword
    }
    User.create(user)
    .then(function(success) {
        response.status(200).send()
    })
    .catch(function(error) {
        response.status(500).send(error)
    })    
});

router.post("/auth/login", function(request, response, next) {
    User.findOne({username: request.body.username})
    .then(function(user) {
      if(user == null) {
        response.status(404).send()
      } else {  
        if(bcrypt.compareSync(request.body.password, user.password)) {
          request.session.user = user
          response.status(200).send(user)
        } else {
          response.status(403).send()
        }
      }
    })
    .catch(function(error) {
      console.log(error)
      response.status(500).send(error)
    })
});

router.post('/auth/logout', function(request, response, next) { 
  request.session.destroy(function(error) {
    if(error) console.log("Couldn't destroy the sesson")
  })
  response.status(200).send()
});

router.get('/auth/profile', isLoggedIn, function(req, res, next) { 
  res.status(200).send(req.session.user)
});

module.exports = router;
