//-------------------models-------------------//
import transactionModel from '../models/transactionModel.js';
import userModel from '../models/userModel.js';

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
export async function getAllUsers(req, res) {
  try {
    const users = await userModel
      .find({ role: 'user' }, { _v: 0, password: 0 })
      .sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
export async function getUserTransactions(req, res) {
  try {
    const userId = req.params.userId;
    const transactions = await transactionModel
      .find({ userId })
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
