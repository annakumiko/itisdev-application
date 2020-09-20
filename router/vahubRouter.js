const express = require('express');
const router = express();
const middleware = require('../middleware/vahubMiddleware');
const controller = require('../controller/indexController');

/*GET functions*/
router.get('/login', controller.getLogin);
router.get('/', controller.getHome);
router.get('/trainer-profile', controller.getProfile);
router.get('/trainee-profile', controller.getProfile);

//admin
router.get('/define-course', controller.getDefineCourse);
router.get('/clientlist', controller.getClientList);
router.get('/manage-clientlist', controller.getManageClients);

// TRAINER
router.get('/dashboard', controller.getDashboard);
router.get('/create-class', controller.getCreateClass);
router.get('/add-trainees', controller.getAddTrainees);

// TRAINEE
router.get('/verification', controller.getVerification);
router.get('/clientlist', controller.getClientList);
router.get('/view-grades', controller.getViewGrades);
//router.get('/contact-clients', controller.getContactClient);

/*POST functions*/
router.post('/logout', controller.postLogout);
router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);

//admin
router.post('/define-course', controller.postDefineCourse);
//router.post('/manage-clientlist', controller.postManageClients);

// TRAINER
router.post('/create-class', controller.postCreateClass);
// router.post('/add-trainees', middleware.validateAddTrainees, controller.postAddTrainees);

// TRAINEE
router.post('/verification', controller.postVerification);
//router.post('/contact-clientslist', controller.postContactClient);


module.exports = router;