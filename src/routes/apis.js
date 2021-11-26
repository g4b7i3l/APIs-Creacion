var express = require('express');
var router = express.Router();

const {list,detail,create} = require ('../controllers/apisController.js')


/* endpoints: /apis.. */
router  
    .get('/',list)
    .get('/:id',detail)
    .post('/',create)

module.exports = router;
