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

export async function editProfile(req, res) {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    console.log(name);

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { name: name } },
      { new: true, select: '-password -__v' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
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
      .populate('book')
      .select('-__v');

    res.status(200).json({ borrowedBooks: borrowedBooks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
