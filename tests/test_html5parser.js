var HTML5 = require('html5/parser').HTML5;

p = new HTML5.Parser("<html><head><title>Hello!</title></head><body><p>Hi!</p><div>Testing</div></body></html>");

var sys = require('sys');

sys.puts(sys.inspect(p.tree, false, null));
