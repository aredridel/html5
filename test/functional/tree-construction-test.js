var HTML5 = require('../../lib/html5'),
	events = require('events'),
	fs = require('fs'),
	test = require('tap').test,
	serialize = require('../lib/serializeTestOutput').serializeTestOutput;

var support = require('../lib/readTestData')
var base = __dirname + '/../../data/tree-construction/'
var testList = fs.readdirSync(base);
for(var i in testList) {
	var testname = testList[i];

	if(testname.match(/\.js$/)) continue;

	if(fs.statSync(base+testname).isDirectory()) continue;

	var testData = support.readTestData(base+testname);

	for(var i in testData) {
        (function(td) {
            test(testname+':'+i, function(t) {
                try {
                    var p = new HTML5.Parser()
                    if(td['document-fragment']) {
                        p.parse_fragment(td.data.slice(0, td.data.length - 1), td['document-fragment'].trimRight())
                    } else {
                        p.parse(td.data.slice(0, td.data.length - 1));
                    }
                    var serialized = serialize(p.inner_html ? p.tree.getFragment() : p.tree.document);
					t.equal(serialized, td.document, "Document matches example data")
                    t.ok("No exception");
                } catch(e) {
                    t.notOK("Exception thrown: " + e)
                }
                t.end()
            })
		})(testData[i])
	}
}
