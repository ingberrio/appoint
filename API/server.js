import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import customerRoutes from './routes/customerRoutes.js'
import specialistRoutes from './routes/specialistRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import specialtyRoutes from './routes/specialtyRoutes.js';
import customer from './routes/customerRoutes.js';
import diaryRoutes from './routes/diaryRoutes.js';
import abailabilityRoutes from './routes/abailabilityRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import cors from 'cors';

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors())

// Allows to parser Json
app.use(express.json());

// Allows to send data format
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/specialists', specialistRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/specialty', specialtyRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/availability', abailabilityRoutes);
app.use('/api/appointments', appointmentRoutes);


if (process.env.MODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));

export default app;