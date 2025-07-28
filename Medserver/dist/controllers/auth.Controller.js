"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const userDao = __importStar(require("../daos/user.dao"));
const authUtils = __importStar(require("../utils/auths"));
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("signup hit");
        const { mobile, password } = req.body;
        const user = yield userDao.createNewUser(mobile, password);
        const token = authUtils.generateToken(user.mobile);
        res.status(201).json({ token });
    }
    catch (err) {
        res.status(500).json({ message: 'something went wrong while signUp',
            errors: err
        });
    }
});
exports.signUp = signUp;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobile, password } = req.body;
        const user = yield userDao.getUser(mobile);
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }
        const isMatch = authUtils.comparePassword(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid mobile or password' });
            return;
        }
        const token = authUtils.generateToken(mobile);
        res.status(200).json({ token });
    }
    catch (err) {
        next(err);
    }
});
exports.signIn = signIn;
