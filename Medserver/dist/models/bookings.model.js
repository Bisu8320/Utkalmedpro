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
const mongoose_1 = __importStar(require("mongoose"));
const ServiceRequestSchema = new mongoose_1.Schema({
    userId: {
        type: String
    },
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
    },
    email: {
        type: String,
        trim: true,
    },
    serviceAddress: {
        type: String,
        required: [true, 'Service Address is required'],
        trim: true,
    },
    serviceName: {
        type: String,
        required: [true, 'Service name is required'],
    },
    preferredDate: {
        type: Date,
        required: [true, 'Preferred date is required'],
        validate: {
            validator: function (v) {
                return v >= new Date();
            },
            message: 'Preferred date must be today or in the future'
        }
    },
    preferredTime: {
        type: String,
        required: [true, 'Preferred time is required'],
    },
    additionalNotes: {
        type: String,
        trim: true,
        maxlength: [500, 'Additional notes cannot exceed 500 characters']
    },
}, {
    timestamps: true
});
// Create the model
const ServiceRequest = mongoose_1.default.model('ServiceRequest', ServiceRequestSchema);
exports.default = ServiceRequest;
