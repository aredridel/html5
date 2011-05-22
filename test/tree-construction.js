var HTML5 = require('../lib/html5'),
	events = require('events'),
	fs = require('fs'),
	vows = require('vows'),
	assert = require('assert'),
	serialize = require('./support/serializeTestOutput').serializeTestOutput;

var suite = vows.describe('tree-construction')

var support = require('./support/readTestData')
var base = 'testdata/tree-construction/'
var testList = fs.readdirSync(base);
for(var t in testList) {
	var testname = testList[t];
	if(testname.match(/\.js$/)) continue;
	if(fs.statSync(base+testname).isDirectory()) continue;
	var testData = support.readTestData(base+testname);
	var batch = {}
	for(var i in testData) {
		batch[testname+':'+i] = (function(td) {
			return {
				topic: function() {
					o = {}
					try {
						var p = new HTML5.Parser()
						if(td['document-fragment']) {
							p.parse_fragment(td.data.slice(0, td.data.length - 1), td['document-fragment'].trimRight())
						} else {
							p.parse(td.data.slice(0, td.data.length - 1));
						}
						o.serialized = serialize(p.inner_html ? p.tree.getFragment() : p.tree.document);
					} catch(e) {
						o.exception = e
					}
					return o	
				},
				'should match test data': function(result) {
					assert.equal(result.serialized, td.document)
				},
				'should not throw an exception': function(result) {
					assert.isUndefined(result.exception)
				}
			}
		})(testData[i])
	}

	suite.addBatch(batch)
}


suite.export(module)
