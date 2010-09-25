require.paths.push('lib')
require.paths.push('.')
require.paths.push('deps/jsdom/lib')
require.paths.push('deps/nodeunit/lib')

var testrunner = require('testrunner');
var args = process.ARGV.slice(2);
if(args.length > 0) {
	testrunner.run(args);
} else {
	testrunner.run(['tests'])
}
