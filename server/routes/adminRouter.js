import express from 'express';
const router = express.Router();

//---------------middlewares-----------------//
import verifyUser from '../middlewares/verifyUser.js';

//-------------------------controllers------------------------------//

//---------book-controllers---//

import { getAllTransactions } from '../controllers/adminControllers.js';
import { addBook, editBook } from '../controllers/bookControllers.js';
import roleCheck from '../middlewares/roleCheck.js';

//-------------------------------------------------------------------------//

//----------------------book----------------------//
router.post('/book/add', verifyUser, roleCheck('admin'), addBook);
router.put('/book/:bookId/edit', verifyUser, roleCheck('admin'), editBook);

//----------------------transactions----------------------//
router.get('/transactions', verifyUser, roleCheck('admin'), getAllTransactions);

export default router;
