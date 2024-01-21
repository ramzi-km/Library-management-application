//-------------------models-------------------//
import transactionModel from '../models/transactionModel.js';

export async function getAllTransactions(req, res) {
  try {
    const transactions = await transactionModel
      .find()
      .populate('user', '-password')
      .populate('book')
      .sort({ updatedAt: -1 })
      .select('-__v');
    res.status(200).json({ transactions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
