sys = require('sys');
HTTP = require('http');
URL = require ('url');

handlers = {
	"text/html": function(inr, outr) {
		outr.writeHead(inr.statusCode, inr.headers);
		inr.addListener('data', function(chunk) { outr.write(chunk, 'binary'); });
		inr.addListener('end', function() { outr.close(); });
	},
	'default': function(inr, outr) {
		outr.writeHead(inr.statusCode, inr.headers);
		inr.addListener('data', function(chunk) { outr.write(chunk, 'binary'); });
		inr.addListener('end', function() { outr.close(); });
	}
}

HTTP.createServer(function(inreq,outresp) {
	var url = URL.parse(inreq.url);
	sys.puts(inreq.method + " for " + url.hostname + " on port " + (url.port || 80) + " with path " + (url.pathname || '/'));
	var client = HTTP.createClient(url.port || 80, url.hostname);
	var outreq = client.request(inreq.method, (url.pathname || '/') + (url.search || ''), inreq.headers);
	sys.puts(JSON.stringify(inreq.headers));

	outreq.addListener('response', function(inresp) {
		// Handle types here
		if(handlers[inresp.headers['content-type']]) {
			handlers[inresp.headers['content-type']](inresp, outresp);
		} else {
			handlers['default'](inresp, outresp);
		}
	});

	// Set up relaying the incoming request to the remote server
	inreq.addListener('data', function(chunk) { 
		outreq.write(chunk); 
	});

	// Finish the client request when the request finishes
	inreq.addListener('end', function() { 
		outreq.close(); 
	});

}).listen(8080);
