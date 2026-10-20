import express from 'express';
import prisma from './lib/db.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json()); // Parse JSON request bodies into req.body (needed by POST/PATCH handlers)

// Example: test the connection
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use('/api', routes);
app.use(notFound, errorHandler);

app.listen(3000, () => console.log('Server running on port 3000'));