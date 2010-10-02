require.paths.unshift('lib')
require.paths.unshift('.')
require.paths.unshift('deps/jsdom/lib')

var testrunner = require('testrunner');
var args = process.ARGV.slice(2);
if(args.length > 0) {
	testrunner.run(args);
} else {
	testrunner.run(['tests'])
}
