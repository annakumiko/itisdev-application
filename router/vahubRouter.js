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
router.get('/update-clientlist', controller.getUpdateClients);

// TRAINER
router.get('/dashboard', controller.getDashboard);
router.get('/create-class', controller.getCreateClass);
router.get('/add-trainees/:section/:course', controller.getAddTrainees);
router.get('/quiz-list', controller.getQuizList);
router.get('/create-quiz', controller.getCreateQuiz);
router.get('/update-scoresheet', controller.getUpdateScoresheet);


// TRAINEE
router.get('/verification', controller.getVerification);
router.get('/clientlist', controller.getClientList);
router.get('/view-grades', controller.getViewGrades);
router.get('/contact-client/:email/:companyName', controller.getContactClient);

/*POST functions*/
router.post('/logout', controller.postLogout);
router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);

//admin
router.post('/define-course', controller.postDefineCourse);
router.post('/add-client', controller.postAddClient);
router.post('/remove-client', controller.postRemoveClient);
router.post('/update-clientlist', controller.postUpdateClients);

// TRAINER
router.post('/create-class', middleware.validateCreateClass, controller.postCreateClass);
router.post('/add-trainees', controller.postAddTrainees);
router.post('/delete-class', controller.postDeleteClass);

// TRAINEE
router.post('/verification', controller.postVerification);
router.post('/contact-client', controller.postContactClient);


module.exports = router;