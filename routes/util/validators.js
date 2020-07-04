
const {check, body} = require('express-validator')


module.exports =  
{
    validateUser: [
      check('firstName')
        .exists({checkNull: true, checkFalsy: true})
        .withMessage('First name can not be empty'),
      check('lastName')
        .exists({checkNull: true, checkFalsy: true})
        .withMessage('Last name can not be empty'),
      check('password')
        .exists({checkNull: true, checkFalsy: true})
        .withMessage('Password can not be empty'),
      check('emailAddress')
        .exists({checkNull: true, checkFalsy: true})
        .withMessage('Email can not be empty')
        .bail()
        .isEmail()
        .withMessage('Email provided is not valid')
    ],
    validateNewCourse: [
      check('title')
        .exists({checkNull: true, checkFalsy: true})
        .withMessage('Title can not be empty'),
      check('description')
        .exists({checkNull: true, checkFalsy: true})
        .withMessage('Description can not be empty'),
    ],
    validateUpdateCourse: [
      check(['title'])
        .if(check('title').exists())
        .notEmpty()
        .withMessage('Title can not be empty'),
      check('description')
        .if(check('description').exists())
        .notEmpty()
        .withMessage('Title can not be empty'),
    ]
  }
