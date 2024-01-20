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

import { borrowBook, getAllBooks } from '../controllers/bookControllers.js';
import roleCheck from '../middlewares/roleCheck.js';

//-------------------------------------------------------------------------//

//----------------------auth-----------------------//
router.post('/signup', postSignup);
router.post('/login', postLogin);
router.post('/logout', verifyUser, logout);

//----------------------user-----------------------//
router.get('/user', verifyUser, getUserData);

//----------------------book----------------------//
router.get('/books', verifyUser, getAllBooks);
router.post('/book/:bookId/borrow', verifyUser, roleCheck('user'), borrowBook);

export default router;
