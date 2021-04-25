const Router = require('express');
const router = new Router();

const fileController = require('../controllers/fileController.js');

router.post('/image', fileController.saveImage);
router.get('/image', fileController.getImage);

module.exports = router;
