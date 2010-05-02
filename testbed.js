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

function basic_parser_checks(test, p, d) {
	test.ok(Boolean(p), 'parser exists');
	test.ok(Boolean(p.tree), 'parse tree exists');
	test.ok(new Boolean(p.tree.document), 'parse tree produced a document');
	test.ok(Boolean(p.tree.document.documentElement), 'parse tree set the documentElement');
	test.equals(p.errors.length, d.errorCount);
	test.equals(p.tree.document.xml, d.output);
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
			sys.puts("Input data: " + sys.inspect(td[i].data));
			HTML5.debug('testdata.data', "Data: " + td[i].data);
			var p = new HTML5.Parser(td[i].data);
			var errorsFixed = p.errors.map(function(e) {
				return HTML5.E[e[0]].replace(/%\(.*?\)/, function(r) {
					if(e[1]) {
						return e[1][r.slice(2).slice(0, r.length - 3)];
					} else {
						return r;
					}
				});
			});

		if(td[i].errors) {
			var errorsNoEOF = td[i].errors.filter(function(e) {
				return !(/end of file|EOF/i.test(e));
			});
			//HTML5.debug('testdata.errors', "Expected ", errorsNoEOF);
			//HTML5.debug('testdata.errors', "Actual ", errorsFixed);
			var serialized = serialize(p.tree.document);
			sys.puts("Output : " + sys.inspect(serialized));
			sys.puts("Check  : " + sys.inspect(td[i].document));
			assert.deepEqual(serialized, td[i].document);
			assert.deepEqual(errorsFixed, errorsNoEOF)
			assert.equal(p.errors.length, errorsNoEOF.length);
		}
		} catch(e) {
			sys.puts(e);
		}
	}
}
