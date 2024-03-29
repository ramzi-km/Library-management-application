import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export default async function verifyUser(req, res, next) {
  try {
    const token = req.cookies.userToken;
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided.' });
    }

    const secret = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, secret);

    // Check if the decoded user ID exists in the database
    const user = await userModel.findOne(
      { _id: decoded._id },
      {
        password: 0,
        __v: 0,
      }
    );
    if (!user) {
      res.cookie('userToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 0,
      });
      return res.status(401).json({ message: 'User not found.' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
