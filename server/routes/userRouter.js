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

import {
    editProfile,
    getBorrowedBooks,
    getUserData,
} from '../controllers/userControllers.js';

//---------book-controllers---//

import {
    borrowBook,
    getAllBooks,
    returnBook,
} from '../controllers/bookControllers.js';
import roleCheck from '../middlewares/roleCheck.js';

//-------------------------------------------------------------------------//

//----------------------auth-----------------------//
router.post('/signup', postSignup);
router.post('/login', postLogin);
router.post('/logout', verifyUser, logout);

//----------------------user-----------------------//
router.get('/user', verifyUser, getUserData);
router.post('/user/editProfile', verifyUser, editProfile);

//----------------------book----------------------//
router.get('/books', verifyUser, getAllBooks);
router.get('/books/borrowed', verifyUser, roleCheck('user'), getBorrowedBooks);
router.post('/book/:bookId/borrow', verifyUser, roleCheck('user'), borrowBook);
router.patch(
  '/book/:transactionId/return',
  verifyUser,
  roleCheck('user'),
  returnBook
);

export default router;
