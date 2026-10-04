import express from 'express';
import prisma from './lib/db.js';
import routes from './routes/index.js';

const app = express();

// Example: test the connection
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use('/api', routes);

app.listen(3000, () => console.log('Server running on port 3000'));