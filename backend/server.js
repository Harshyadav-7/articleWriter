import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import articleRoutes from './routes/articleRoutes.js';

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/articles', articleRoutes);

app.get('/', (req, res) => res.send('API is running...'));

app.listen(5001, () => console.log('Server running on port 5001'));