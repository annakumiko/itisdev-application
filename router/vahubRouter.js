const express = require('express');
const router = express();
const controller = require('../controller/indexController');

/*call get functions*/
router.get('/login', controller.getLogin);
router.get('/', controller.getHome);

/*call post functions*/
router.post('/logout', controller.postLogout);
router.post('/login', controller.postLogin);

module.exports = router;