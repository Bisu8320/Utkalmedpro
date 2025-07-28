import mongoose, { Schema, Document } from 'mongoose';

interface IServiceRequest extends Document {
  customerName: string;
  phoneNumber: string;
  email?: string;
  serviceAddress: string;
  serviceName: string;
  preferredDate: Date;
  preferredTime: string;
  additionalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceRequestSchema: Schema = new Schema({
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
      validator: function(v: Date) {
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
const ServiceRequest = mongoose.model<IServiceRequest>('ServiceRequest', ServiceRequestSchema);

export default ServiceRequest;