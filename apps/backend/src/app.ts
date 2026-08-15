import 'dotenv/config';
import express from 'express';
import authRoutes from './auth/auth.route.js';
import userRoutes from './users/user.router.js';
import groupRoutes from './groups/group.router.js'


const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/groups', groupRoutes);



app.get("/", (req, res) => {
  res.json({
    message: "Group Chat Backend Running"
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'shaitan-backend' });
});

export default app;
