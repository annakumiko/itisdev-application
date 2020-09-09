const express = require('express');
const router = express();
const controller = require('../controller/indexController');

/*GET functions*/
router.get('/login', controller.getLogin);
router.get('/', controller.getHome);
router.get('/trainer-profile', controller.getProfile);
router.get('/trainee-profile', controller.getProfile);
router.get('/create-class', controller.getCreateClass);

router.get('/verification', controller.getVerifyAccount);
router.get('/clients', controller.getClientsList);
//router.get('/contact-clients', controller.getContactClient);

/*POST functions*/
router.post('/logout', controller.postLogout);
router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);

router.post('/verification', controller.postVerifyAccount);
//router.get('/manage-clients', controller.postManageClients);
//router.get('/contact-clients', controller.getContactClient);

module.exports = router;