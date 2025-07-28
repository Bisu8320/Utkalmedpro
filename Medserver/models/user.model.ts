import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
});

export const UserModel = mongoose.model('User', userSchema);
