import jwt from "jsonwebtoken";
import { Configs } from "../configs/config";
import bcrypt from 'bcrypt';

export const generateToken = (mobile: string) => {
  const token = jwt.sign({ mobile }, Configs.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, Configs.JWT_SECRET);
  return decoded;
};

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

export const comparePassword = (password: string, hashedPassword: string) => {
  const isMatch = bcrypt.compareSync(password, hashedPassword);
  return isMatch;
};