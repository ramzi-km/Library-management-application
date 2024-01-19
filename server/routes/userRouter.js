import express from 'express';
const router = express.Router();

//---------------middlewares-----------------//

//-------------------------controllers------------------------------//

//---------auth-controllers---//
import {
    logout,
    postLogin,
    postSignup,
} from '../controllers/authControllers.js';
import { getUserData } from '../controllers/userControllers.js';
import verifyUser from '../middlewares/verifyUser.js';

//-------------------------------------------------------------------------//

//----------------------auth-----------------------//
router.post('/signup', postSignup);
router.post('/login', postLogin);
router.post('/logout', verifyUser, logout);

//----------------------user-----------------------//
router.get('/user', verifyUser, getUserData);

export default router;
