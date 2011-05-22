require.paths.unshift('lib')
require.paths.unshift('.')

var reporter = require('nodeunit').reporters.default;
var args = process.ARGV.slice(2);
if(args.length > 0) {
	reporter.run(args);
} else {
	reporter.run(['test'])
}
