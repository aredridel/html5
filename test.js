require.paths.push('lib')
require.paths.push('.')

var HTML5 = require('html5')
HTML5.enableDebug('tokenizer');
HTML5.enableDebug('parser');

var testrunner = require('testrunner');
testrunner.run(['tests'])
