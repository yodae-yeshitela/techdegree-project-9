const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const {validationResult} = require('express-validator');

//middleware to authenticate user
const authenticateUser = require('./util/authenticate'); 
//asynchandler middleware
const asyncHandler = require('./util/asyncHandler');
//middleware to validate data submitted
const {validateNewCourse, validateUpdateCourse}  = require('./util/validators')
//import database models for course and users
const {User, Course} = require('./../db');

//Route to get all courses in the database
router.get('/', asyncHandler(async(req,res,next) => {
    const courses = 
        await Course.findAll({
            attributes: [["id","courseId"],"title","description","estimatedTime","materialsNeeded"],
            include: {
                model: User,
                as: 'user',
                attributes: [["id","userId"],"firstName","lastName","emailAddress"]
            }
        });
    res.json(courses);
}));

//route to get a course by its id
router.get('/:id', asyncHandler(async(req,res,next) => {
    const course = 
        await Course.findByPk(req.params.id, {
            attributes: [["id","courseId"],"title","description","estimatedTime","materialsNeeded"],
            include: {
                model: User,
                as: 'user',
                attributes: [["id","userId"],"firstName","lastName","emailAddress"]
            }
        });
    res.json(course);
}));

//route to add a new course to the database
router.post('/',authenticateUser, validateNewCourse , asyncHandler(async(req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const err = createError(400);
        err.details = errors.array().map( e => e.msg);
        return next(err);
    }
    let course = await Course.create({userId : req.currentUserId,...req.body});
    res.status(201).header('Location', `api/courses/${course.id}`).end();
    })
);

//route to update a course
router.put('/:id', authenticateUser, validateUpdateCourse, async(req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const err = createError(400);
        err.details = errors.array().map( e => e.msg);
        return next(err);
    };

    const course = await Course.findByPk(req.params.id);

    if(course === null){
        const error = createError(400);
        error.details = "Course not found";
        return next(error);
    }
    if(course.userId != req.currentUserId){
        return res.status(403).json({message: "User not authorized to make edits to course"})
    }

    const updateData = {};
    
    Object.keys(req.body).forEach( (key) => {
        if(['title','description','estimatedTime','materialsNeeded'].includes(key)){
            updateData[key] = req.body[key];
        }
    })

    if(Object.keys(updateData).length === 0){
        return res.status(400).json({
            message: "Course not updated",
            details: "Update course data provided is empty or format is incorrect"
        })
    }

    await course.update(updateData);
    res.status(204).end();

})

//route to delete a course
router.delete( '/:id', authenticateUser, async (req,res,next) => {
    const course = await Course.findByPk(req.params.id);

    if(course === null){
        const error = createError(400);
        error.details = "Course not found";
        return next(error);
    }
    if(course.userId != req.currentUserId){
        return res.status(403).json({message: "User not authorized to delete course"})
    }
    
    await course.destroy();

    res.status(204).end();
})

module.exports = router;