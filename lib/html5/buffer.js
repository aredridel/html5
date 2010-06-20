var buffer = require('buffer');
var HTML5 = require('../html5');

function Buffer() {
	this.data = '';
	this.start = this.committed = 0;
	var eof;
	this.__defineSetter__('eof', function(f) {
		eof = f
		if(eof) this.append("\0")
	})
	this.__defineGetter__('eof', function() { return eof })
	this.eof = false;
}

exports.Buffer = Buffer;

Buffer.prototype = {
	slice: function() {
		if(this.start >= this.data.length) {
			if(!this.eof) throw 'drain';
			return HTML5.EOF;
		}
		return this.data.slice(this.start, this.data.length);
	},
	char: function() {
		if(!this.eof && this.start >= this.data.length - 1) throw 'drain';
		if(this.start >= this.data.length) {
			return "\0";
		}
		return this.data[this.start++];
	},
	advance: function(amount) {
		this.start += amount;
		if(this.start >= this.data.length) {	
			if(!this.eof) throw 'drain';
		} else {
			if(this.committed > this.data.length / 2) {
				// Sliiiide
				this.data = this.data.slice(this.committed);
				this.start = this.start - this.committed;
				this.committed = 0;
			}
		}
	},
	matchWhile: function(re) {
		if(this.eof && this.data.length == this.start) return '';
		var r = new RegExp("^"+re+"+");
		if(m = r.exec(this.slice())) {
			if(!this.eof && m[0].length == this.data.length - this.start) throw('drain');
			this.advance(m[0].length);
			return m[0];
		} else {
			return '';
		}
	},
	matchUntil: function(re) {
		if(m = new RegExp(re + (this.eof ? "|\0" : "")).exec(this.slice())) {
			var t = this.data.slice(this.start, this.start + m.index);
			this.advance(m.index);
			return t.toString();
		} else {
			if(this.eof) return '';
			throw('drain');
		}
	},
	append: function(data) {
		this.data += data
	},
	shift: function(n) {
		if(!this.eof && this.start + n >= this.data.length) throw('drain');
		var d = this.data.slice(this.start, this.start + n).toString();
		this.advance(Math.min(n, this.data.length - this.start));
		return d;
	},
	peek: function(n) {
		if(!this.eof && this.start + n >= this.data.length) throw('drain');
		return this.data.slice(this.start, Math.min(this.start + n, this.data.length)).toString();
	},
	length: function() {
		return this.data.length - this.start - 1;
	},
	unget: function(d) {
		this.start -= (d.length);
	},
	undo: function() {
		this.start = this.committed;
	},
	commit: function() {
		this.committed = this.start;
	}
}
