
exports.testSerializer = function(test) {
	test.expect(1);
	var HTML5 = require('html5');
	var p = new HTML5.Parser();
	p.parse('<p class="Hello">Hi!</p><p class="hello there">Hi again</p>');
	test.equals(HTML5.serialize(p.tree.document, null, {lowercase: true}), '<html><head></head><body><p class=Hello>Hi!</p><p class="hello there">Hi again</p></body></html>');
	test.done();
}
