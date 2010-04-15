var HTML5 = require('html5/parser').HTML5;
var assert = require('assert');
var sys = require('sys');

var data = {
	trivial: {
		code: "<html><head><title>Hello!</title></head><body><p>Hi!</p><div>Testing</div></body></html>",
		errorCount: 1,
		output: { root: { name: 'html', children: [ 
			{ name: 'head', children: [ 
				{ name: 'title' , children: [ 
					{ value: 'Hello!' } ],
					attributes: [] }
			], attributes: [] }, 
			{ name: 'body' ,children: [ 
				{ value: 'Hi!' }, 
				{ name: 'p', children: [], attributes: {} }, 
				{ name: 'div', children: [ 
					{ value: 'Testing'} ], attributes: [] }
			], attributes: {} } ] }
		},
	},
	attr: {
		code: "<html><head profile='x'><title>Hello!</title></head><body class='test'></body></html>",
		errorCount: 1
	},
	minimal: {
		code: "<p>Hi!</p>",
		errorCount: 1
	},
	unfinished: {
		code: "<html><head><title>Well then",
	},
};

function basic_parser_checks(p, d) {
	assert.ok(p);
	assert.ok(p.tree);
	assert.ok(p.tree.document);
	assert.ok(p.tree.document.root);
	if(d.errorCount) assert.equal(p.errors.length, d.errorCount);
	// FIXME: circular objects if(d.output) assert.deepEqual(p.tree.document, d.output);
}

for(i in data) {
	p = new HTML5.Parser(data[i].code);
	basic_parser_checks(p, data[i]);
	sys.puts(sys.inspect(p.tree.document, false, null));
	sys.puts(sys.inspect(p.errors, false, null));
}
