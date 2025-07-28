import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import {authAndAttachUser} from './middlewares/auth.middleware';
import { Configs } from './configs/config';
import authRoutes from './routes/auth.routes';
import bookingingsRoutes from './routes/bookingings.routes';
const app = express();
const PORT = 8080;
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(authAndAttachUser);
authRoutes(app);
bookingingsRoutes(app);
app.use(errors());

app.listen(PORT, async() => {
    await connectDb();
    console.log(`🚀  Server is running on port ${PORT}`);
});



export const connectDb = async () => {
    try {
      await mongoose.connect(Configs.MONGODB_URL);
      console.log('✅ DB connected');
    } catch (error) {
      console.error('❌ DB connection error:', error);
      process.exit(1);
    }
  };
