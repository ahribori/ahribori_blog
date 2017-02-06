const env = process.env.NODE_ENV;
const config = (function (){
	if (env === 'development') {
		/*---------------------------------------
		 DEVELOPMENT
		 ----------------------------------------*/
		return {
			TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNTg3ZWNmYjA2MWRiMTAyODcwZjY1YWJhIiwiYXBwIjoiYWhyaWJvcmkiLCJpYXQiOjE0ODQ3MTIwMjAsImlzcyI6ImFocmlib3JpLmNvbSIsInN1YiI6ImFwcGxpY2F0aW9uSW5mbyJ9.vSRtwJjDZxeQkWIiwTrF0GHhPw4j7DGJ9sNSA3Key8A',
			AUTH_SERVER: 'http://localhost:30000',
			API_SERVER: 'http://localhost:3000'
		}
	} else if (env === 'production') {
		/*---------------------------------------
		 PRODUCTION
		 ----------------------------------------*/
		return {
			TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNTg3ZWNmYjA2MWRiMTAyODcwZjY1YWJhIiwiYXBwIjoiYWhyaWJvcmkiLCJpYXQiOjE0ODQ3MTIwMjAsImlzcyI6ImFocmlib3JpLmNvbSIsInN1YiI6ImFwcGxpY2F0aW9uSW5mbyJ9.vSRtwJjDZxeQkWIiwTrF0GHhPw4j7DGJ9sNSA3Key8A',
			AUTH_SERVER: 'https://auth.ahribori.com',
			API_SERVER: 'https://api.ahribori.com'
		}
	}
}());
export default config;