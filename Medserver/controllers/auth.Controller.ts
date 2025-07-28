import { Request, Response } from "express";
import { sendSMS } from "../services/sms.service";
import { setOtpForNumber, verifyOtpForNumber } from "../services/otp.service";
import * as userDao from "../daos/user.dao";
import * as authUtils from "../utils/auths";

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const mobile = req.body.mobile;
    const formatted = `+91${mobile}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await sendSMS(formatted, `Your OTP is ${otp}`);
    setOtpForNumber(mobile, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mobile, otp } = req.body;
    const isValid = verifyOtpForNumber(mobile, otp);

    if (!isValid) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    let user = await userDao.getUser(mobile);
    if (!user) {
      user = await userDao.createNewUser(mobile); // no password needed
    }

    const token = authUtils.generateToken(mobile);
    res.status(200).json({ token });
  } catch (err) {
    console.error("OTP verification failed:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
