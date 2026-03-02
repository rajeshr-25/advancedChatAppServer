import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ msg: "Missing authorization header" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ msg: "Invalid authorization format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId + username
    next();
  } catch {
    return res.status(403).json({ msg: "Invalid or expired token" });
  }
}