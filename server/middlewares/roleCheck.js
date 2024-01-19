export default function roleCheck(requiredRole) {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (userRole == requiredRole) {
      return next();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  };
}
