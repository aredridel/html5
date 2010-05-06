exports.testWalker = function(test) {
	test.expect(1);
	var HTML5 = require('html5');

	var p = new HTML5.Parser('<p>Hi!</p>');

	var r = [];
	var w = new HTML5.TreeWalker(p.tree.document, function(token) {
		r.push(token);
	});

	test.same(r, [
		{ type: 'StartTag', name: 'html', data: {} },
		{ type: 'StartTag', name: 'head', data: {} },
		{ type: 'EndTag', name: 'head' },
		{ type: 'StartTag', name: 'body', data: {} },
		{ type: 'StartTag', name: 'p', data: {} },
		{ type: 'Characters', data: 'Hi!' },
		{ type: 'EndTag', name: 'p' },
		{ type: 'EndTag', name: 'body' },
		{ type: 'EndTag', name: 'html' },
	]);

	test.done();
}
