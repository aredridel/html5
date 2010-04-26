var HTML5 = require('html5');
var sys = require('sys');

var p = new HTML5.Parser('<p>Hi!</p>');

var w = new HTML5.TreeWalker(p.tree.document, function(token) {
	sys.puts(sys.inspect(token));
});
