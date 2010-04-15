var HTML5 = require('html5/parser').HTML5;
var assert = require('assert');
var sys = require('sys');

var data = {
	trivial: "<html><head><title>Hello!</title></head><body><p>Hi!</p><div>Testing</div></body></html>",
	attr: "<html><head profile='x'><title>Hello!</title></head><body class='test'></body></html>",
	minimal: "<p>Hi!</p>",
};

function basic_parser_checks(p) {
	assert.ok(p);
	assert.ok(p.tree);
	assert.ok(p.tree.document);
}

for(i in data) {
	p = new HTML5.Parser(data[i]);
	basic_parser_checks(p);
	sys.puts(sys.inspect(p.tree.document, false, null));
}
