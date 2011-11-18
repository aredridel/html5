var HTML5 = require('../../lib/html5'),
	events = require('events'),
	fs = require('fs'),
	test = require('tap').test,
	serialize = require('../lib/serializeTestOutput').serializeTestOutput;

var support = require('../lib/readTestData')
var base = __dirname + '/../../data/tree-construction/'
var testList = fs.readdirSync(base);

if(typeof process.argv[2] != 'undefined') {
    var logdata = true
    var skipToTest = process.argv[2]
} else {
    var logdata = false
    var skipToTest = false
}

if(typeof process.argv[3] != 'undefined') {
    var skipToTestNumber = process.argv[3]
} else {
    var skipToTestNumber = false
}

for(var i in testList) {
	var testname = testList[i];

	if(testname.match(/\.js$/)) continue;

	if(fs.statSync(base+testname).isDirectory()) continue;

	var testData = support.readTestData(base+testname);

	for(var i in testData) {
        (function(td) {
            if(skipToTest) {
                if(skipToTest != testname) return;
                if(skipToTestNumber && skipToTestNumber != i) return;
            }
            test(testname+':'+i, function(t) {
                try {
                    var p = new HTML5.Parser()
                    if(logdata) {
                        console.log("Input: " + td.data)
                        console.log("Expected: " + td.document)
                    }
                    if(td['document-fragment']) {
                        p.parse_fragment(td.data.slice(0, td.data.length - 1), td['document-fragment'].trimRight())
                    } else {
                        p.parse(td.data.slice(0, td.data.length - 1));
                    }
                    var serialized = serialize(p.inner_html ? p.tree.getFragment() : p.tree.document);
					t.equal(serialized, td.document, "Document matches example data")
                    t.ok("No exception");
                } catch(e) {
                    if(logdata) {
                        throw e
                    } else {
                        t.fail("Exception thrown: " + e)
                    }
                }
                t.end()
            })
		})(testData[i])
	}
}
