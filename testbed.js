require.paths.push('lib');
var HTML5 = require('html5'),
	events = require('events'),
	sys = require('sys'),
	fs = require('fs'),
	assert = require('assert'),
	serialize = require('./tests/support/serializeTestOutput').serializeTestOutput;

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
	sys.puts("Test file: " + testname);
	var f = require('./tests/support/readTestData')
	var td = f.readTestData(base+testname);
	var tests = 1;
	for(var i in td) {
		try {
			if(process.argv[3] && process.argv[3] != i) continue;
			sys.puts("Test #" + i + ": ");
			sys.puts("Input data: " + sys.inspect(td[i].data.trimRight()));
			sys.puts("Input document fragment: " + sys.inspect(td[i]['document-fragment']))
			var p = new HTML5.Parser(td[i].data.trimRight(), td[i]['document-fragment'] ? {inner_html: td[i]['document-fragment'].trimRight()} : {});
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

			assert.ok(p.tree);
			assert.ok(p.tree.document);
			HTML5.debug('testbed', "parse complete");

			HTML5.debug('testdata.errors', "Expected ", td[i].errors);
			HTML5.debug('testdata.errors', "Actual ", errorsFixed);
			var serialized = serialize(p.inner_html ? p.tree.getFragment() : p.tree.document);
			sys.puts("Output : " + serialized);
			sys.puts("Check  : " + td[i].document);
			assert.deepEqual(serialized, td[i].document);
			if(td[i].errors && p.errors.length !== td[i].errors.length) {
				sys.puts("Expected errors: " + sys.inspect(td[i].errors));
				sys.puts("Actual errors  : " + sys.inspect(p.errors));
			}
		} catch(e) {
                        sys.puts(e.stack + '\n');
		}
	}
}
