var sys = require('sys');
var tcp = require('tcp');
var events = require('events');

const EXPECT_NICK = 1;

function Server(name) {
	events.EventEmitter.call(this);
	this.clients = new Array();
	this.name = name;
	this.addListener('newClient', function(client) {
		this.clients.push(client);
	});
}

function ClientConnection(socket, server) {
	socket.setEncoding('binary');
	socket.addListener('connect', function() {
		server.emit('newClient', socket);
		this.state = EXPECT_NICK;
	});
	socket.addListener('data', lineBuffer(this));
	this.addListener('line', function(str) { sys.puts(str); });
	this.socket = socket;
	this.server = server;
}

sys.inherits(Server, events.EventEmitter);
sys.inherits(ClientConnection, events.EventEmitter);

Server.prototype.newClient = function() {
	return function(socket) {
		socket.write(":" +this.name+" NOTICE Auth :*** Looking up your hostname...\r\n");
	}
}

exports.createServer = function(name) {
	var server = new Server(name);
	server.socket = tcp.createServer(function(socket) {
		var client = new ClientConnection(socket, server);
		server.emit('newClient', client);
	});
	return server;
}

function lineBuffer(recvr) {
	var buffer = '';
	return function(data) {
		buffer += data;
		var i;
		if((i = buffer.indexOf('\n')) != -1) {
			recvr.emit('line', buffer.substr(0, i));
			buffer = buffer.substr(i + 1);
		}
		sys.print(buffer);
	}
}

Server.prototype.listen = function(port) {
	this.socket.listen(port);
}
