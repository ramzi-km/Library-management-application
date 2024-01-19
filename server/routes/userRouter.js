import express from 'express';
const router = express.Router();

//---------------middlewares-----------------//
import verifyUser from '../middlewares/verifyUser.js';

//-------------------------controllers------------------------------//

//---------auth-controllers---//
import {
    logout,
    postLogin,
    postSignup,
} from '../controllers/authControllers.js';

//---------user-controllers---//

import { getUserData } from '../controllers/userControllers.js';

//---------book-controllers---//

import { getAllBooks } from '../controllers/bookControllers.js';

//-------------------------------------------------------------------------//

//----------------------auth-----------------------//
router.post('/signup', postSignup);
router.post('/login', postLogin);
router.post('/logout', verifyUser, logout);

//----------------------user-----------------------//
router.get('/user', verifyUser, getUserData);

//----------------------book----------------------//
router.get('/books', verifyUser, getAllBooks);

export default router;
