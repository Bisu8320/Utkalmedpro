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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookService = void 0;
const userDao = __importStar(require("../daos/user.dao"));
const sms_service_1 = require("../services/sms.service");
const bookService = (req, res, next) => {
    console.log("user is", req.auth.mobile);
    const { customerName, phoneNumber, email, serviceAddress, serviceName, preferredDate, preferredTime, additionalNotes, } = req.body;
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
        (0, sms_service_1.prepareSms)(customerName, phoneNumber, email, serviceAddress, serviceName, preferredDate, preferredTime, additionalNotes).catch(console.error);
    });
};
exports.bookService = bookService;
