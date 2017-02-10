import express from 'express';
const router = express.Router();
import article from './article';
import article_temp from './article_temp';
import image from './image';
import authMiddleware from '../middlewares/auth';

router.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'ahribori API server'
	});
});

router.use('/api', authMiddleware);
router.use('/api/article', article);
router.use('/api/article_temp', article_temp);

// router.use('/image', authMiddleware);
router.use('/image', image);

export default router;