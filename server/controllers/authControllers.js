import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//-------------------models-------------------//
import userModel from '../models/userModel.js';

export async function postSignup(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password || !name || !role) {
      return res.status(422).json({ message: 'Provide necessary information' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const findEmail = await userModel.findOne({ email });

    if (findEmail) {
      return res.status(403).json({ message: 'User already exists' });
    } else {
      const user = new userModel({
        name: name,
        email: email,
        password: passwordHash,
        role: role,
      });
      await user.save();
      const result = await userModel.findOne(
        { email: user.email },
        {
          _id: 0,
          password: 0,
          __v: 0,
        }
      );
      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ _id: user._id, role: user.role }, secret);
      res.cookie('userToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3 * 24 * 1000 * 60 * 60,
      });
      return res.status(200).json({ user: result });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function postLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ message: 'Provide necessary information' });
    }
    const user = await userModel.findOne({ email });
    if (user) {
      const comparison = await bcrypt.compare(password, user.password);
      if (comparison) {
        const secret = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ _id: user._id, role: user.role }, secret);
        res.cookie('userToken', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 3 * 24 * 1000 * 60 * 60, // 3 day
        });
        const resUser = await userModel.findOne(
          { email: user.email },
          {
            _id: 0,
            password: 0,
            __v: 0,
          }
        );
        return res.json({ user: resUser });
      } else {
        return res.status(403).json({ message: 'Incorrect Password' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function logout(req, res) {
  try {
    res.cookie('userToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 0,
    });
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'internal server error' });
  }
}
