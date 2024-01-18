import express from 'express';
const router = express.Router();

//---------------middlewares-----------------//

//-------------------------controllers------------------------------//

//---------auth-controllers---//
import {
    postSignup,
    resendOtp,
    signupVerify,
} from '../controllers/authControllers.js';

//-------------------------------------------------------------------------//

//----------------------auth-----------------------//
router.post('/signUp', postSignup);
router.post('/verifySignup', signupVerify);
router.post('/resendSignupOtp', resendOtp);
// router.post('/login', postLogin);
// router.post('/logout', logout);


export default router