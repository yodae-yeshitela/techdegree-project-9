const express = require('express');
const router = express.Router();
const {User} = require('./../db');
const authenticateUser = require('./util/authenticate');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const asyncHandler = require('./util/asyncHandler');
const {validateUser}  = require('./util/validators')
const createError = require('http-errors');

//get the user information if the user authenticates successfully
router.get('/', authenticateUser, async(req,res,next) => {
  const user = 
    await User.findByPk( req.currentUserId,{
      attributes: [["id","userId"], "firstName", "lastName", "emailAddress"]
    });
  res.json(user);
  }
);

//create a new user
router.post('/', validateUser, asyncHandler(async(req,res,next) => {
    const results = validationResult(req);
    if(!results.isEmpty()){
      const err = createError(400);
      err.details = results.array().map( err => err.msg);
      return next(err);
    }
    const password = bcryptjs.hashSync(req.body.password);
    let user;
    try {
       user = await User.create ({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password,
        emailAddress: req.body.emailAddress
      })
    }
    catch (error) {
      if(error.name === "SequelizeUniqueConstraintError"){
        let err = createError(409);
        err.details = "Email address already in use";
        return next(err);
      }
      throw error;
    }
    res.header('Location','/');
    res.status(201);
    res.end();
  }
));

module.exports = router;