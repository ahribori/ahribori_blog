const env = process.env.NODE_ENV;
const config = (function (){
	if (env === 'development') {
		/*---------------------------------------
		 DEVELOPMENT
		 ----------------------------------------*/
		return {
			PORT: 30000,
			MONGO_URI: 'mongodb://192.168.0.200:27017/api',
			SECRET: 'AhRiBoRiSeCrEtKey'
		}
	} else if (env === 'production') {
		/*---------------------------------------
		 PRODUCTION
		 ----------------------------------------*/
		return {
			PORT: 30000,
			MONGO_URI: 'mongodb://localhost:27017/api',
			SECRET: 'AhRiBoRiSeCrEtKey'
		}
	}
}());
export default config;