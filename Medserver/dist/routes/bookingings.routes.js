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
const express_1 = require("express");
const celebrate_1 = require("celebrate");
const serviceController = __importStar(require("../controllers/service.controller"));
const router = (0, express_1.Router)();
exports.default = (app) => {
    app.use("/", router);
    router.post('/book', (0, celebrate_1.celebrate)({
        [celebrate_1.Segments.BODY]: celebrate_1.Joi.object({
            customerName: celebrate_1.Joi.string().min(3).max(100).required(),
            phoneNumber: celebrate_1.Joi.string().pattern(/^\+91[0-9]{10}$/).required(),
            email: celebrate_1.Joi.string().email().optional(),
            serviceAddress: celebrate_1.Joi.string().min(10).required(),
            serviceName: celebrate_1.Joi.string(),
            preferredDate: celebrate_1.Joi.date(),
            preferredTime: celebrate_1.Joi.string().pattern(/^([0-1]\d|2[0-3]):?([0-5]\d)$/).required(), // Example: 14:30
            additionalNotes: celebrate_1.Joi.string().max(500).optional(),
        }),
    }), serviceController.bookService);
};
