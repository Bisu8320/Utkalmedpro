"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../configs/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken = (mobile) => {
    const token = jsonwebtoken_1.default.sign({ mobile }, config_1.Configs.JWT_SECRET, {
        expiresIn: "1d",
    });
    return token;
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.Configs.JWT_SECRET);
    return decoded;
};
exports.verifyToken = verifyToken;
const hashPassword = (password) => {
    const salt = bcrypt_1.default.genSaltSync(10);
    const hashedPassword = bcrypt_1.default.hashSync(password, salt);
    return hashedPassword;
};
exports.hashPassword = hashPassword;
const comparePassword = (password, hashedPassword) => {
    const isMatch = bcrypt_1.default.compareSync(password, hashedPassword);
    return isMatch;
};
exports.comparePassword = comparePassword;
