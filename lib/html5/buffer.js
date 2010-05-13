var buffer = require('buffer');
var HTML5 = require('html5');

function Buffer() {
	this.data = new buffer.Buffer(4096);
	this.start = this.end = this.committed = 0;
	var eof;
	this.__defineSetter__('eof', function(f) {
		HTML5.debug('buffer.eof', f)
		eof = f
	})
	this.__defineGetter__('eof', function() { return eof })
	this.eof = false;
}

exports.Buffer = Buffer;

Buffer.prototype = {
	slice: function() {
		return this.data.slice(this.start, this.end);
	},
	advance: function(amount) {
		this.start += amount;
		if(this.committed > this.data.length / 2) {
			// Sliiiide
			this.data.copy(this.data, 0, this.committed, this.end);
			this.end = this.end - this.committed;
			this.start = this.start - this.committed;
			this.committed = 0;
		}
	},
	matchWhile: function(re) {
		if(this.eof && this.end == this.start) return HTML5.EOF; 
		var r = new RegExp("^"+re+"+");
		if(m = r.exec(this.slice())) {
			if(!this.eof && m[0].length == this.end - this.start) throw('drain');
			this.advance(m[0].length);
			return m[0];
		} else {
			return '';
		}
	},
	matchUntil: function(re) {
		if(m = new RegExp(re + (this.eof ? "|$" : "")).exec(this.slice())) {
			var t = this.data.slice(this.start, this.start + m.index);
			this.advance(m.index);
			return t.toString();
		} else {
			if(this.eof) return '';
			throw('drain');
		}
	},
	append: function(data) {
		if(this.end + data.length <= this.data.length) {
			this.data.write(data, 'binary', this.end);
			this.end += data.length;
		} else {
			var temp = new buffer.Buffer((this.data.length + data.length) * 2);
			this.data.copy(temp, 0, this.committed, this.end);
			this.end -= this.committed;
			this.start -= this.committed;
			this.committed = 0;
			this.data = temp;
		}
	},
	shift: function(n) {
		if(this.eof && this.end == this.start) return HTML5.EOF;
		if(!this.eof && this.start + n >= this.end) throw('drain');
		HTML5.debug('buffer.shift', this.start, n)
		d = this.data.slice(this.start, this.start + n).toString();
		this.advance(n);
		return d;
	},
	peek: function(n) {
		if(this.eof && this.end == this.start) return HTML5.EOF;
		if(!this.eof && this.start + n >= this.end) throw('drain');
		return this.data.slice(this.start, this.start + n).toString();
	},
	length: function() {
		return this.end - this.start;
	},
	unget: function(d) {
		if(d == HTML5.EOF) return;
		HTML5.debug('buffer.unget', this.start, d.length)
		this.start -= (d.length);
	},
	undo: function() {
		HTML5.debug('buffer.undo', this.start, this.committed)
		this.start = this.committed;
	},
	commit: function() {
		this.committed = this.start;
	}
}
