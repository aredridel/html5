var HTML5 = require('html5');
var sys = require('sys');

var p = new HTML5.Parser('<p>Hi!</p>');
sys.debug(HTML5.serialize(p.tree.document));

