"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareSms = exports.sendSMS = void 0;
const twilio_1 = __importDefault(require("twilio"));
const config_1 = require("../configs/config");
const accountSid = config_1.Configs.TWILIO_ACCOUNT_SID;
const authToken = config_1.Configs.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = config_1.Configs.TWILIO_PHONE_NUMBER;
const client = (0, twilio_1.default)(accountSid, authToken);
/**
 * Send a single SMS using Twilio
 */
const sendSMS = (to, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("sending sms to", to);
        const message = yield client.messages.create({
            body,
            from: twilioPhoneNumber,
            to,
        });
        console.log('✅ SMS sent:', message.sid);
    }
    catch (error) {
        console.error('❌ Failed to send SMS:', error);
        throw error;
    }
});
exports.sendSMS = sendSMS;
/**
 * Prepare and send SMS to both admin and customer
 */
const prepareSms = (customerName, customerPhoneNumber, customerEmail, customerAddress, serviceName, customerDate, customerTime, customerAdditionalNotes) => __awaiter(void 0, void 0, void 0, function* () {
    const adminSMS = `📩Hey Admin New Booking Request From ${customerName}\nPhone: ${customerPhoneNumber}`;
    const customerSMS = `Hi ${customerName}, your booking request has been received! We'll get back to you soon.`;
    // Send both SMS in parallel (non-blocking relative to each other)
    Promise.all([
        (0, exports.sendSMS)(config_1.Configs.ADMIN_PHONE_NUMBER, adminSMS).catch((e) => {
            console.error('❌ Failed to send SMS to admin:', e.message);
        }),
        (0, exports.sendSMS)(customerPhoneNumber, customerSMS).catch((e) => {
            console.error('❌ Failed to send SMS to customer:', e.message);
        }),
    ]);
});
exports.prepareSms = prepareSms;
