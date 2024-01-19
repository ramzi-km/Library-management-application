import express from 'express';
const router = express.Router();

//---------------middlewares-----------------//
import verifyUser from '../middlewares/verifyUser.js';

//-------------------------controllers------------------------------//

//---------book-controllers---//

import { addBook } from '../controllers/bookControllers.js';
import roleCheck from '../middlewares/roleCheck.js';

//-------------------------------------------------------------------------//

//----------------------book----------------------//
router.post('/book/add', verifyUser, roleCheck('admin'), addBook);

export default router;
