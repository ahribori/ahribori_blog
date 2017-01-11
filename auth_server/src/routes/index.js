import express from 'express';
const router = express.Router();
import auth from './auth';
import user from './user';
import authMiddleware from '../middlewares/auth';

router.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'ahribori authorization server'
	});
});

router.use('/auth', auth);
router.use('/user', authMiddleware);
router.use('/user', user);

export default router;