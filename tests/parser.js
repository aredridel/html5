var HTML5 = require('html5'),
	events = require('events'),
	fs = require('fs'),
	nodeunit = require('nodeunit');

var data = {
	trivial: {
		code: "<html><head><title>Hello!</title></head><body><p>Hi!</p><div>Testing</div></body></html>",
		output: "<html><head><title>Hello!</title></head><body><p>Hi!</p><div>Testing</div></body></html>",
		errorCount: 1,
	},
	attr: {
		code: "<html><head profile='x'><title>Hello!</title></head><body class='test'></body></html>",
		output: "<html><head profile='x'><title>Hello!</title></head><body class='test'></body></html>",
		errorCount: 1,
	},
	minimal: {
		code: "<p>Hi!</p>",
		output: "<html><head/><body><p>Hi!</p></body></html>",
		errorCount: 1,
	},
	unfinished: {
		code: "<html><head><title>Well then",
		output: "<html><head><title>Well then</title></html>",
		errorCount: 3,
	},
};

function basic_parser_checks(test, p, d) {
	test.ok(Boolean(p), 'parser exists');
	test.ok(Boolean(p.tree), 'parse tree exists');
	test.ok(new Boolean(p.tree.document), 'parse tree produced a document');
	test.ok(Boolean(p.tree.document.documentElement), 'parse tree set the documentElement');
	test.equals(p.errors.length, d.errorCount);
	test.equals(p.tree.document.xml, d.output);
}

exports.testParserBasic = function(test) {
	var c = 0;
	for(var i in data) {
		c++;
	}
	test.expect(c * 6);
	for(i in data) {
		var p = new HTML5.Parser(data[i].code);
		basic_parser_checks(test, p, data[i]);
	}
	test.done();
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
require('sys').debug(l);
for(var t in l) {
	var testname = l[t];
	if(!testname.match(/\.js$/)) continue;
	exports[testname] = (function(tn) { 
		return function(test) {
			test.expect(1);
			fs.readFile(base+tn, 'utf8', function(err, data) {
				if(err) throw(err);
				var testData = JSON.parse(data);
				for(var i in testData) {
					var p = new HTML5.Parser(testData[i].data);
					require('sys').debug(p.errors);
					test.equals(p.tree.document.xml, testData[i].document);
				}
				test.done();
			}); 
		}
	})(testname);
}
