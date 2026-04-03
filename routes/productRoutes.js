const productCtrl = require('../controllers/productController');

router.get('/', productCtrl.index);