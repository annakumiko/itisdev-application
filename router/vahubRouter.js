const express = require('express');
const router = express();
const controller = require('../controller/indexController');

/*GET functions*/
router.get('/login', controller.getLogin);
router.get('/', controller.getHome);
router.get('/trainer-profile', controller.getProfile);
router.get('/trainee-profile', controller.getProfile);
router.get('/create-class', controller.getCreateClass);

//admin
//router.get('/define-course', controller.getDefineCourse);
//router.get('/manage-clientslist', controller.getManageClients);

//trainer
//router.get('/trainer-dashboard', controller.getDashboard);
// router.get('/quizlist', controller.getQuizList);

//trainee
router.get('/verification', controller.getVerifyAccount);
//router.get('/trainer-dashboard', controller.getDashboard);
router.get('/clientslist', controller.getClientsList);
//router.get('/contact-clients', controller.getContactClient);

/*POST functions*/
router.post('/logout', controller.postLogout);
router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);

//admin
//router.post('/define-course', controller.postDefineCourse);
//router.post('/manage-clientslist', controller.postManageClients);

//trainer
// router.post('/quizlist', controller.postQuizList);

//trainee
router.post('/verification', controller.postVerifyAccount);
//router.post('/trainer-dashboard', controller.postDashboard);
//router.post('/contact-clientslist', controller.postContactClient);


module.exports = router;