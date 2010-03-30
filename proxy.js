sys = require('sys');
HTTP = require('http');
URL = require ('url');

HTTP.createServer(function(inreq,outresp) {
	var url = URL.parse(inreq.url);
	sys.puts(inreq.method + " for " + url.hostname + " on port " + (url.port || 80) + " with path " + (url.pathname || '/'));
	var client = HTTP.createClient(url.port || 80, url.hostname);
	var outreq = client.request(inreq.method, (url.pathname || '/') + (url.search || ''), inreq.headers);
	sys.puts(JSON.stringify(inreq.headers));

	outreq.addListener('response', function(inresp) {
		outresp.writeHead(inresp.statusCode, inresp.headers);
		sys.puts("" + inresp.statusCode);
		sys.puts(JSON.stringify(inresp.headers));
		inresp.addListener('data', function(chunk) {
			outresp.write(chunk, 'binary');
		});
		inresp.addListener('end', function() {
			outresp.close();
		});
	});

	inreq.addListener('data', function(chunk) { 
		outreq.write(chunk); 
	});

	inreq.addListener('end', function() { 
		outreq.close(); 
	});

}).listen(8080);
