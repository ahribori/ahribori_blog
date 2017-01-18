import express from 'express';
const router = express.Router();
import Article from '../models/article';

/* =========================================
 POST /api/article
 {

 }
 ============================================*/
router.post('/', (req, res) => {
	// TODO Article 등록
});
Article.create(1331, { name: '정현승'}, '제목', '내용', false);
/* =========================================
 GET /api/article/{articleNumber}
 ============================================*/
router.get('/:articleNumber', (req, res) => {
	console.log(req.params.articleNumber);
	res.json(req.payload);
});

/* =========================================
 UPDATE /api/article/{articleNumber}
 {
 
 }
 ============================================*/
router.put('/:articleNumber', (req, res) => {
	// TODO Article 수정
});

/* =========================================
 DELETE /api/article/{articleNumber}
 ============================================*/
router.delete('/:articleNumber', (req, res) => {
	// TODO Article 삭제
});

export default router;