import { Request, Response, NextFunction } from "express";
import * as userDao from '../daos/user.dao';
import {prepareSms} from '../services/sms.service';
import { sendBookingNotificationEmail, sendCustomerConfirmationEmail } from '../services/email.service';

export const bookService = (req: Request, res: Response, next: NextFunction) => {
    console.log("user is", req.auth.mobile);
    const {
        customerName,
        phoneNumber,
        email,
        serviceAddress,
        serviceName,
        preferredDate,
        preferredTime,
        additionalNotes,
    } = req.body;

    const serviceRequest = {
        userId: req.auth.mobile,
        customerName,
        phoneNumber,
        email,
        serviceAddress,
        serviceName,
        preferredDate,
        preferredTime,
        additionalNotes,
    };
    
    const newBooking = userDao.createNewServiceRequest(serviceRequest);
    if (!newBooking) {
        res.status(500).json({ message: 'Failed to create service booking' });
        return;
    }
    console.log("new booking added");
    res.status(200).json({ message: 'Service Booked Successfully' });

    setImmediate(() => {
        // Send Gmail notification to admin
        sendBookingNotificationEmail(
          customerName,
          phoneNumber,
          email,
          serviceAddress,
          serviceName,
          preferredDate,
          preferredTime,
          additionalNotes
        ).catch(console.error);

        // Send confirmation email to customer (if email provided)
        sendCustomerConfirmationEmail(
          customerName,
          email,
          serviceName,
          preferredDate,
          preferredTime
        ).catch(console.error);

        // Send SMS notifications
        prepareSms(
          customerName,
          phoneNumber,
          email,
          serviceAddress,
          serviceName,
          preferredDate,
          preferredTime,
          additionalNotes
        ).catch(console.error);
      });
      
};