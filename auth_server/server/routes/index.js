import express from 'express';
const router = express.Router();
import auth from './auth';
import user from './user';
import authMiddleware from '../middlewares/auth';
import CORS from '../middlewares/CORS';

router.use('*', CORS);
router.use('/auth', auth);
router.use('/user', authMiddleware);
router.use('/user', user);

export default router;