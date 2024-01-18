import express from 'express';
const router = express.Router();

//---------------middlewares-----------------//

//-------------------------controllers------------------------------//

//---------auth-controllers---//
import {
    postLogin,
    postSignup,
} from '../controllers/authControllers.js';

//-------------------------------------------------------------------------//

//----------------------auth-----------------------//
router.post('/signup', postSignup);
router.post('/login', postLogin);
// router.post('/logout', logout);

export default router;
