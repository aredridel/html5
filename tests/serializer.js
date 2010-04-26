
exports.testSerializer = function(test) {
	test.expect(1);
	var HTML5 = require('html5');
	var p = new HTML5.Parser('<p>Hi!</p>');
	test.equals(HTML5.serialize(p.tree.document), '<html><head></head><body><p>Hi!</p></body></html>');
	test.done();
}
