// Mounts every resource router. In server.js: app.use('/api', routes)
import express from 'express';
import userRoutes from './userRoutes.js';
import postRoutes from './postRoutes.js';
import commentRoutes from './commentRoutes.js';
import feedRoutes from './feedRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/feed', feedRoutes);

export default router;
