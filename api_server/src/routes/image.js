import express from 'express';
const router = express.Router();
import multipart from 'connect-multiparty';
import path from 'path';
const mulipartMiddleware = multipart({
	uploadDir: path.resolve(__dirname, '../../public/image')
});
/* =========================================
 POST /image
 {
 }
 ============================================*/
router.post('/ckeditor_dragndrop', mulipartMiddleware, (req, res) => {
	console.log(req.files);
	res.json({
		uploaded: 1,
		fileName: 'test.jpg',
		url: 'http://localhost:3000/image'
	});
});

// router.post('/ckeditor_imageupload', (req, res) => {
// 	const { CKEditor, CKEditorFuncNum, langCode} = req.query;
// 	let responseData = `<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction(${CKEditorFuncNum},` +
// 		                 `'[이미지 URL]', '[이미지 업로드 성공 얼럿 메세지]')` +
// 		                 `</script>`;
// 	// responseData = `<script>console.log(window.parent)</script>`;
// 	// res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
// 	res.send(responseData);
// });

export default router;