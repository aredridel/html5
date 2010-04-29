var HTML5 = require('html5'),
	events = require('events'),
	fs = require('fs'),
	nodeunit = require('nodeunit');

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
			for(i in td) {
				HTML5.debug('testdata', "Data: " + td[i].data);
				var p = new HTML5.Parser(td[i].data);
				if(td[i].errors) {
					test.equals(p.errors.length, td[i].errors.length);
					tests += 1;
				}
			}

			test.ok(tests > 1);
			test.done();
		}
	})(base+testname);
}
