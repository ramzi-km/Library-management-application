import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//------------------helper-funcions-------------------//
import otpGenerator from 'otp-generator';
import handleLoggedInUser from '../helpers/handleLoggedInUser.js';
import sentOtp from '../helpers/sentOtp.js';

//-------------------models-------------------//
import tempUserModel from '../models/tempUserModel.js';
import userModel from '../models/userModel.js';

export async function postSignup(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password || !name || !role) {
      return res.status(422).json({ message: 'provide necessary information' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const findEmail = await userModel.findOne({ email });

    if (findEmail) {
      return res.status(403).json({ message: 'user already exists' });
    } else {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        digits: true,
      });
      const tempUser = await tempUserModel.findOneAndUpdate(
        { email },
        {
          $set: {
            name,
            email,
            password: passwordHash,
            role,
            'otpData.otpValue': otp,
            'otpData.expirationTime': Date.now() + 3 * 60 * 1000,
          },
        },
        {
          new: true,
          upsert: true,
        }
      );
      sentOtp(email, otp);
      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ _id: tempUser._id }, secret);
      res.cookie('tempUserToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 8 * 1000 * 60,
      });
      return res.json({ message: 'otp sented successfully' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'internal server error' });
  }
}

export async function signupVerify(req, res) {
  try {
    const otp = req.body.otp;
    const token = req.cookies.tempUserToken;

    if (!token) {
      return res.status(401).json({ message: 'Please signup again' });
    }

    const secret = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, secret);

    const tempUser = await tempUserModel.findOne({ _id: decoded._id });

    if (
      otp == tempUser?.otpData.otp &&
      Date.now() < tempUser.otpData.expirationTime
    ) {
      const user = new userModel({
        name: tempUser.name,
        email: tempUser.email,
        password: tempUser.password,
        role: tempUser.role,
      });
      await user.save();
      const email = user.email;
      const result = await userModel.findOne(
        { email },
        {
          _id: 0,
          password: 0,
          __v: 0,
        }
      );
      await tempUserModel.findByIdAndDelete(tempUser.id);
      res.cookie('tempUserToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 0,
      });

      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ _id: user._id, role: user.role }, secret);
      res.cookie('userToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3 * 24 * 1000 * 60 * 60,
      });
      return res.status(200).json({ user: result });
    } else {
      return res.status(403).json({ message: 'Invalid otp' });
    }
  } catch (error) {
    res.status(500).json({ message: 'internal server error' });
  }
}

export async function resendOtp(req, res) {
  try {
    const token = req.cookies.tempUserToken;

    if (!token) {
      return res.status(401).json({ message: 'Please signup again' });
    }

    const secret = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, secret);

    const tempUser = await tempUserModel.findOne({ _id: decoded._id });

    if (tempUser) {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        digits: true,
      });
      tempUser.otpData.otpValue = otp;
      tempUser.otpData.expirationTime = Date.now() + 3 * 60 * 1000;
      await tempUser.save();
      sentOtp(tempUser.email, otp);
      return res.status(200).json({ message: 'otp resent successfull' });
    } else {
      return res.status(400).json({ message: 'invalid request' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'internal server error' });
  }
}
