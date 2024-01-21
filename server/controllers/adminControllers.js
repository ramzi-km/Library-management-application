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
    let page = Number(req.query.page ?? 0);
    page = Math.max(page, 0);
    let search = req.query.searchText ?? '';
    search = search.trim();
    const totalUsers = await userModel.countDocuments({
      $or: [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ],
      role: 'user',
    });
    const perPage = 8;
    const lastPage = Math.max(Math.ceil(totalUsers / perPage) - 1, 0);
    page = Math.min(page, lastPage);
    const users = await userModel
      .find({
        $or: [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
        ],
        role: 'user',
      })
      .skip(page * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ users, page, lastPage });
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
