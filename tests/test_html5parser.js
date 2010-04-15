var Parser = require('html5/parser').Parser;

p = new Parser("<html><head><title>Hello!</title></head><body><p>Hi!</p><div>Testing</div></body></html>");

var sys = require('sys');

sys.puts(sys.inspect(p.tree, false, null));
