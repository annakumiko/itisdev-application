const express = require('express');
const router = express();
const middleware = require('../middleware/vahubMiddleware');
const controller = require('../controller/indexController');

/*GET functions*/
router.get('/login', controller.getLogin);
router.get('/', controller.getHome);
router.get('/trainer-profile', controller.getProfile);
router.get('/trainee-profile', controller.getProfile);
router.get('/create-class', controller.getCreateClass);

// ADMIN
//router.get('/define-course', controller.getDefineCourse);
//router.get('/manage-clientslist', controller.getManageClients);

// TRAINER
router.get('/dashboard', controller.getDashboard);
// router.get('/quizlist', controller.getQuizList);

// TRAINEE
router.get('/verification', controller.getVerification);
router.get('/clientslist', controller.getClientsList);
//router.get('/contact-clients', controller.getContactClient);

/*POST functions*/
router.post('/logout', controller.postLogout);
router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);

// ADMIN
//router.post('/define-course', controller.postDefineCourse);
//router.post('/manage-clientslist', controller.postManageClients);

// TRAINER
router.post('/create-class', middleware.validateCreateClass, controller.postCreateClass);

// TRAINEE
router.post('/verification', controller.postVerification);
//router.post('/contact-clientslist', controller.postContactClient);


module.exports = router;