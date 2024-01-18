import jwt from 'jsonwebtoken';

export default async function handleLoggedInUser(user, res) {
  const secret = process.env.JWT_SECRET_KEY;
  const token = jwt.sign({ _id: user._id, role: user.role }, secret);

  res.cookie('userToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });

  return res.status(200).json({ user });
}
