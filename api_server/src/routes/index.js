import express from 'express';
const router = express.Router();
import CORS from '../middlewares/CORS';
import article from './article';

router.use('*', CORS);
router.use('/article', article);

export default router;