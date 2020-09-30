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
router.get('/update-quiz/:quizID/:qDate/:section/:sTime/:eTime/:nTakes', controller.getUpdateQuiz);
router.get('/scoresheets/:section/:day', controller.getScoresheets);
router.get('/classes-summary', controller.getClassSummary);
router.get('/class-detailed/:classid', controller.getClassDetailed);

// TRAINEE
router.get('/verification', controller.getVerification);
router.get('/clientlist', controller.getClientList);
router.get('/view-grades', controller.getViewGrades);
router.get('/contact-client/:email/:companyName', controller.getContactClient);
router.get('/deactivate-account', controller.getDeactivateAccount);

/*POST functions*/
router.post('/logout', controller.postLogout);
router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);

//admin
router.post('/define-course', controller.postDefineCourse);
router.post('/add-client', controller.postAddClient);
router.post('/remove-client', controller.postRemoveClient);
router.post('/update-clientlist', controller.postUpdateClients);
router.get('/trainee-summary', controller.getTraineeSummary);
router.get('/trainee-detailed/:userID', controller.getTraineeDetailed);

// TRAINER
router.post('/create-class', middleware.validateCreateClass, controller.postCreateClass);
router.post('/add-trainees', middleware.validateAddTrainees, controller.postAddTrainees);
router.post('/delete-class', controller.postDeleteClass);
router.post('/remove-trainee', controller.postRemoveTrainee);
router.post('/scoresheets', controller.postScoresheets);
router.post('/create-quiz', middleware.validateCreateQuiz, controller.postCreateQuiz);
router.post('/update-quiz', controller.postUpdateQuiz)

// TRAINEE
router.post('/verification', controller.postVerification);
router.post('/contact-client', controller.postContactClient);
router.post('/deactivate-account', controller.postDeactivateAccount);

module.exports = router;