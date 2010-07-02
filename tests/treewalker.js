exports.testWalker = function(test) {
	test.expect(1);
	var HTML5 = require('html5');

	var p = new HTML5.Parser('<p>Hi!</p>');
	p.parse();

	var r = [];
	var w = new HTML5.TreeWalker(p.tree.document, function(token) {
		r.push(token);
	});

	test.same(r, [
		{ type: 'StartTag', name: 'HTML', data: {} },
		{ type: 'StartTag', name: 'HEAD', data: {} },
		{ type: 'EndTag', name: 'HEAD' },
		{ type: 'StartTag', name: 'BODY', data: {} },
		{ type: 'StartTag', name: 'P', data: {} },
		{ type: 'Characters', data: 'Hi!' },
		{ type: 'EndTag', name: 'P' },
		{ type: 'EndTag', name: 'BODY' },
		{ type: 'EndTag', name: 'HTML' },
	]);

	test.done();
}
