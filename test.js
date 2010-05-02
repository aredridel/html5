require.paths.push('lib')
require.paths.push('.')

var testrunner = require('testrunner');
testrunner.run(['tests'])
