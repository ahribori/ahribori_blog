const env = process.env.NODE_ENV;
const config = (function (){
	if (env === 'development') {
		/*---------------------------------------
		 DEVELOPMENT
		 ----------------------------------------*/
		return {
			TOKEN: 'INPUT YOUR APPLICATION TOKEN',
			AUTH_SERVER: 'http://localhost:30000',
			API_SERVER: 'http://localhost:3000'
		}
	} else if (env === 'production') {
		/*---------------------------------------
		 PRODUCTION
		 ----------------------------------------*/
		return {
			TOKEN: 'INPUT YOUR APPLICATION TOKEN',
			AUTH_SERVER: 'http://auth.ahribori.com',
			API_SERVER: 'http://api.ahribori.com'
		}
	}
}());
export default config;