const express = require ('express');
const router = express.Router();
const userRouter = require('./users')
const courseRouter = require('./courses')

router.use('/users', userRouter)
router.use('/courses', courseRouter)

module.exports = router;