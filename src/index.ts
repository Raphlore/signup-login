import express from 'express'
import connectDB from './config/db'
import dotenv from 'dotenv'
import authRoute from './routes/authRoute'

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoute); // Mounts the router


app.listen(port, () => console.log(`server started on port ${port}`));

export default app;
