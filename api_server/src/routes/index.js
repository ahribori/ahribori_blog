import express from 'express';
const router = express.Router();
import article from './article';

router.use('/article', article);

export default router;