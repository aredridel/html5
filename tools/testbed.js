require.paths.unshift('lib');
require.paths.unshift('deps/jsdom/lib');
var HTML5 = require('html5'),
	events = require('events'),
	sys = require('sys'),
	fs = require('fs'),
	assert = require('assert'),
	serialize = require('../tests/support/serializeTestOutput').serializeTestOutput;

if(process.argv[4]) {
	var debugs = process.argv[4].split(',');
	for(var d in debugs) HTML5.enableDebug(debugs[d]);
}

var base = 'testdata/tree-construction/'
var l = fs.readdirSync(base);
for(var t in l) {
	if(process.argv[2] && process.argv[2] != l[t]) continue;
	var testname = l[t];
	if(testname.match(/\.js$/)) continue;
        if(fs.statSync(base+testname).isDirectory()) continue;
	sys.debug("Test file: " + testname);
	var f = require('../tests/support/readTestData')
	var td = f.readTestData(base+testname);
	var tests = 1;
	for(var i in td) {
		try {
			if(process.argv[3] && process.argv[3] != i) continue;
			sys.debug("Test #" + i + ": ");
			sys.debug("Input data: " + sys.inspect(td[i].data.slice(0, td[i].data.length - 1)));
			if(td[i]['document-fragment']) sys.debug("Input document fragment: " + sys.inspect(td[i]['document-fragment']))
			var p = new HTML5.Parser()
			if(td[i]['document-fragment']) {
				p.parse_fragment(td[i].data.slice(0, td[i].data.length - 1), td[i]['document-fragment'].slice(0, td[i]['document-fragment'].length - 1))
			} else {
				p.parse(td[i].data.slice(0, td[i].data.length - 1));
			}
			var errorsFixed = p.errors.map(function(e) {
				if(!HTML5.E[e[0]]) return e;
				return HTML5.E[e[0]].replace(/%\(.*?\)/, function(r) {
					if(e[1]) {
						return e[1][r.slice(2).slice(0, r.length - 3)];
					} else {
						return r;
					}
				});
			});

			assert.ok(p.document);
			HTML5.debug('testbed', "parse complete");

			HTML5.debug('testdata.errors', "Expected ", td[i].errors);
			HTML5.debug('testdata.errors', "Actual ", errorsFixed);
			var serialized = serialize(p.inner_html ? p.fragment : p.document);
			sys.debug("Output : " + serialized);
			//sys.debug("Tree : " + require('sys').inspect(p));
			sys.debug("Check  : " + td[i].document);
			assert.deepEqual(serialized, td[i].document);
			if(td[i].errors && p.errors.length !== td[i].errors.length) {
				sys.debug("Expected errors: " + sys.inspect(td[i].errors));
				sys.debug("Actual errors  : " + sys.inspect(p.errors));
			}
		} catch(e) {
                        sys.debug('error in parsing: ' + e.message + " " + e.stack);
		}
	}
}
