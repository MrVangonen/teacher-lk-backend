const app = require('express');
const router = new app.Router();
const studentsController = require('../controllers/studentsController.js')
const authenticationController = require('../controllers/authenticationController.js')

// all routes start with '/api'

router.route('/registration')
    .post(authenticationController.registration)

router.route('/checkUsername')
    .post(authenticationController.checkUsername)

router.route('/login')
    .post(authenticationController.login)

router.route('/logout')
    .post(authenticationController.logout)

router.route('/students/:student_id?')
    .get(studentsController.get);

module.exports = router;