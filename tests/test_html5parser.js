var Parser = require('html5parser').Parser;

p = new Parser();

p.parse_string("<html><head><title>Hello!</title></head><body><p>Hi!</p></body></html>");
