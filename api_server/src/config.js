const env = process.env.NODE_ENV;
const config = (function (){
	if (env === 'development') {
		/*---------------------------------------
						DEVELOPMENT
		 ----------------------------------------*/
		return {
			PORT: 3000,
			MONGO_URI: 'mongodb://localhost:27017/api',
			API_SERVER: 'http://localhost:3000',
			AUTH_SERVER: 'http://localhost:30000',
			IMAGE_REPOSITORY: ''
		}
	} else if (env === 'production') {
		/*---------------------------------------
						PRODUCTION
		 ----------------------------------------*/
		return {
			PORT: 3000,
			MONGO_URI: 'mongodb://localhost:27017/api',
			API_SERVER: 'https://api.ahribori.com',
			AUTH_SERVER: 'https://auth.ahribori.com',
			IMAGE_REPOSITORY: ''
		}
	}
}());
export default config;