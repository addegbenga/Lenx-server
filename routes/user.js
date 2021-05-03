const express = require('express');
const router = express.Router();
const {check} = require('express-validator/check');

const { requireSignin, isAuth, isAdmin } = require('../controller/auth.controller');

const { userById, read, update, purchaseHistory, } = require('../controller/user.controller');

const { forgotPasswordController, resetPasswordController } = require('../controller/password.controller')

const { resetPasswordValidator, forgotPasswordValidator } = require('../validator/index')

router.get('/secret', requireSignin, (req, res) => {
    res.json({
        user: 'got here yay'
    });
});

router.get('/:userId', requireSignin, isAuth, read);
router.put('/:userId', requireSignin, isAuth, update);
router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory);


//Password RESET
router.put('/recover', forgotPasswordValidator, forgotPasswordController);
   
router.put('/resetpassword', resetPasswordValidator, resetPasswordController);

router.param('userId', userById);  

module.exports = router;