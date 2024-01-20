//-------------------models-------------------//
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


