import express from 'express';
const router = express.Router();
import multipart from 'connect-multiparty';
import path from 'path';
import fs from 'fs';

const publicPath = path.resolve(__dirname, '../../public');
const imagePath = path.resolve(__dirname, '../../public/image');

if(!fs.existsSync(publicPath)) {
	fs.mkdirSync(publicPath);
}

if (!fs.existsSync(imagePath)) {
	fs.mkdirSync(imagePath);
}

const mulipartMiddleware = multipart({
	uploadDir: imagePath,

});

/* =========================================
 POST /image
 {
 }
 ============================================*/
router.post('/ckeditor_dragndrop', mulipartMiddleware, (req, res) => {
	const uploadedFile = req.files.upload;
	req.files = null;
	res.json({
		uploaded: 1,
		fileName: path.basename(uploadedFile.path),
		url: 'http://localhost:3000/image/' + path.basename(uploadedFile.path)
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