import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

export async function register(req, res) {
  const { email, username, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ msg: "Email already exists" });

  const hash = await bcrypt.hash(password, 10);

  await User.create({
    userId: uuid(),
    email,
    username,
    passwordHash: hash,
    lastSeen: new Date()
  });

  return res.json({ msg: "Registered" });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user.userId, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.json({ token });
}