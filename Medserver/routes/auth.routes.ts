import { Router } from "express";
import { Joi, Segments, celebrate } from "celebrate";
import * as authController from "../controllers/auth.Controller";

const router = Router();
export default (app: Router) => {
  app.use("/api", router);

  router.post(
    "/send-otp",
    celebrate({
      [Segments.BODY]: Joi.object({
        mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
      }),
    }),
    authController.sendOtp
  );
  
  router.post(
    "/verify-otp",
    celebrate({
      [Segments.BODY]: Joi.object({
        mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
        otp: Joi.string().length(6).required(),
      }),
    }),
    authController.verifyOtp
  );
  
};
