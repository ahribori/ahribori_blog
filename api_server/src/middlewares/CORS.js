const CORS = (req, res, next) => {
	res.header('Acess-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	(req.method === 'OPTIONS') ? res.send(200) : next();
};

export default CORS;