import { Router } from "express";
import { Joi, Segments, celebrate } from "celebrate";
import * as serviceController from "../controllers/service.controller";


const router = Router();
export default (app: Router) => {
  app.use("/", router);

  router.post(
    '/book',
    celebrate({
      [Segments.BODY]: Joi.object({
        customerName: Joi.string().min(3).max(100).required(),
        phoneNumber: Joi.string().pattern(/^\+91[0-9]{10}$/).required(),
        email: Joi.string().email().optional(),
        serviceAddress: Joi.string().min(10).required(),
        serviceName: Joi.string(),
        preferredDate: Joi.date(),
        preferredTime: Joi.string().pattern(/^([0-1]\d|2[0-3]):?([0-5]\d)$/).required(), // Example: 14:30
        additionalNotes: Joi.string().max(500).optional(),
      }),
    }),
    serviceController.bookService
  );
};


