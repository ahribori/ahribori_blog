const env = process.env.NODE_ENV;
const config = (function (){
	if (env === 'development') {
		/*---------------------------------------
						DEVELOPMENT
		 ----------------------------------------*/
		return {
			PORT: 3000,
			MONGO_URI: 'mongodb://192.168.0.200:27017/api',
			AUTH_SERVER: 'http://localhost:30000'
		}
	} else if (env === 'production') {
		/*---------------------------------------
						PRODUCTION
		 ----------------------------------------*/
		return {
			PORT: 3000,
			MONGO_URI: 'mongodb://localhost:27017/api',
			AUTH_SERVER: 'http://auth.ahribori.com'
		}
	}
}());
export default config;