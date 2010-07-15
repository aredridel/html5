require.paths.push('lib')
require.paths.push('.')
require.paths.push('deps/jsdom/lib')

var testrunner = require('testrunner');
testrunner.run(['tests'])
