const path = require('path');
const fs = require('fs');

const DIR = fs.realpathSync(process.cwd());

function resolvePath(relativePath) {
    return path.resolve(DIR, relativePath);
}

module.exports = {
    public: resolvePath('public'),
    context: resolvePath('client/src/'),
    sdkIndexJs: resolvePath('client/src/sdk/sdk.js'),
	clbIndexJS: resolvePath('client/src/sdk/clbScript.js'),
    appIndexJs: resolvePath('client/src/index.js'),
    appBuild: resolvePath('public')
};
