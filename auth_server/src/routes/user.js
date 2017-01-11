import express from 'express';
const router = express.Router();
import User from '../models/user';

/* =========================================
		 	GET /user/list
 ============================================*/
router.get('/list', (req, res) => {
	if (!req.decoded.admin) {
		return res.status(403).json({
			message: 'you are not an admin'
		});
	}

	User.find({})
		.then((users) => {
			res.json(users);
		});
});

/* =========================================
 			POST /user/assign-admin
 ============================================*/
router.post('/assign-admin/:username', (req, res) => {
	if (!req.decoded.admin) {
		return res.status(403).json({
			message: 'you are not an admin'
		})
	}

	User.findOneByUsername(req.params.username)
		.then(user => user.assignAdmin)
		.then(res.json({
			success: true
		})
	)
});

export default router;