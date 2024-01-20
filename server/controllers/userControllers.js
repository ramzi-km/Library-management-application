//-------------------models-------------------//
import transactionModel from '../models/transactionModel.js';
import userModel from '../models/userModel.js';

export async function getUserData(req, res) {
  try {
    const userId = req.user.id;
    const user = await userModel.findOne(
      { _id: userId },
      {
        _id: 0,
        password: 0,
        __v: 0,
      }
    );
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function getBorrowedBooks(req, res) {
  try {
    const userId = req.user.id;
    const borrowedBooks = await transactionModel
      .find({
        userId,
        status: 'borrowed',
      })
      .populate('bookId')
      .select('-__v');
    const remappedTransactions = borrowedBooks.map((transaction) => {
      const transactionObj = transaction.toObject();
      transactionObj.book = transactionObj.bookId;
      delete transactionObj.bookId;
      return transactionObj;
    });
    res.status(200).json({ borrowedBooks: remappedTransactions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
