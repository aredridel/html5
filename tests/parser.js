var HTML5 = require('html5'),
	events = require('events'),
	fs = require('fs'),
	nodeunit = require('nodeunit'),
	serialize = require('./support/serializeTestOutput').serializeTestOutput;

function basic_parser_checks(test, p, d) {
	test.ok(Boolean(p), 'parser exists');
	test.ok(Boolean(p.tree), 'parse tree exists');
	test.ok(new Boolean(p.tree.document), 'parse tree produced a document');
	test.ok(Boolean(p.tree.document.documentElement), 'parse tree set the documentElement');
	test.equals(p.errors.length, d.errorCount);
	test.equals(p.tree.document.xml, d.output);
}

exports.testParserStreaming = function(test) {
	test.expect(1);
	var em = new events.EventEmitter();
	p = new HTML5.Parser(em);
	em.emit('data', '<p>This is a');
	em.emit('data', ' test of the <e');
	em.emit('data', 'm>emergency</em> broadcast system');
	em.emit('end', '');
	test.equals(p.tree.document.xml, "<html><head/><body><p>This is a test of the <em>emergency</em> broadcast system</p></body></html>");
	test.done();
}


var base = 'testdata/tree-construction/'
var l = fs.readdirSync(base);
for(var t in l) {
	var testname = l[t];
	if(testname.match(/\.js$/)) continue;
	exports[base+testname] = (function(tn) {
		return function(test) {
			test.expect(1);
			var f = require('./support/readTestData')
			var td = f.readTestData(tn);
			var tests = 1;
			for(var i in td) {
				HTML5.debug('testdata.data', "Data: " + td[i].data);
				var p = new HTML5.Parser(td[i].data.trimRight());
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

				if(td[i].errors) {
					//HTML5.debug('testdata.errors', "Expected ", td[i].errors);
					//HTML5.debug('testdata.errors', "Actual ", errorsFixed);
					var serialized = serialize(p.tree.document);
					test.same(serialized, td[i].document);
					test.same(errorsFixed, td[i].errors)
					test.equals(p.errors.length, td[i].errors.length);
					tests += 3;
				}
			}

			test.ok(tests > 1);
			test.expect(tests);
			test.done();
		}
	})(base+testname);
}
