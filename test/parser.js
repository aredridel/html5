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
	p = new HTML5.Parser();
	p.parse(em);
	em.emit('data', '<p>This is a');
	em.emit('data', ' test of the <e');
	em.emit('data', 'm>emergency</em> broadcast system');
	em.emit('end');
	test.equals(serialize(p.document), '<html>\n  <head>\n  <body>\n    <p>\n      "This is a test of the "\n      <em>\n        "emergency"\n      " broadcast system"\n');
	test.done();
}


var base = 'testdata/tree-construction/'
var l = fs.readdirSync(base);
for(var t in l) {
	var testname = l[t];
	if(testname.match(/\.js$/)) continue;
	if(fs.statSync(base+testname).isDirectory()) continue;
	var f = require('./support/readTestData')
	var td = f.readTestData(base+testname);
	for(var i in td) {
		exports[base+testname+':'+i] = (function(td) { 
			return function(test) {
				var tests = 1;
				test.expect(1);
				HTML5.debug('testdata.data', "Data: " + td.data);
				HTML5.debug('testdata.data', "Fragment: " + td['document-fragment']);
				var p = new HTML5.Parser()
				if(td['document-fragment']) {
					p.parse_fragment(td.data.slice(0, td.data.length - 1), td['document-fragment'].trimRight())
				} else {
					p.parse(td.data.slice(0, td.data.length - 1));
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

				var serialized = serialize(p.inner_html ? p.tree.getFragment() : p.tree.document);
				test.same(serialized, td.document); tests++;
				if(false && td.errors) {
					test.equals(p.errors.length, td.errors.length); tests++;
				}
				//test.same(errorsFixed, td.errors); tests++;

				test.ok(tests > 1);
				test.expect(tests);
				test.done();
			 }
		})(td[i])

	}
}
