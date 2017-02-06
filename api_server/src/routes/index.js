import express from 'express';
const router = express.Router();
import article from './article';
import authMiddleware from '../middlewares/auth';

router.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'ahribori API server'
	});
});

router.use('/api', authMiddleware);
router.use('/api/article', article);


export default router;