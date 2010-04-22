var buffer = require('buffer');
var HTML5 = require('html5');

function Buffer() {
	this.data = new buffer.Buffer(4096);
	this.start = this.end = this.committed = 0;
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
		var r = new RegExp("^"+re+"+");
		if(m = r.exec(this.slice())) {
			if(!this.eof && m[0].length == this.end - this.start) throw('drain');
			this.advance(m[0].length);
			HTML5.debug('matchWhile produced "' + m[0]+ '"');
			return m[0];
		} else {
			HTML5.debug('matchWhile produced nothing');
			return '';
		}
	},
	matchUntil: function(re) {
		if(m = new RegExp(re).exec(this.slice())) {
			var t = this.data.slice(this.start, this.start + m.index);
			this.advance(m.index);
			HTML5.debug('matchUntil produced "' + t.toString()+ '"');
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
			var temp = new buffer.Buffer((this.data.length + data.length) * 1.8);
			this.data.copy(temp, 0, this.committed, this.end);
			this.end -= this.committed;
			this.start -= this.committed;
			this.committed = 0;
			this.data = temp;
		}
	},
	shift: function(n) {
		if(!this.eof && this.start + n >= this.end) throw('drain');
		d = this.data.slice(this.start, this.start + n).toString();
		this.advance(n);
		HTML5.debug('shift produced "' + d + '"');
		return d;
	},
	peek: function(n) {
		if(!this.eof && this.start + n >= this.end) throw('drain');
		HTML5.debug('peek produced "' + this.data.slice(this.start, this.start + n).toString() + '"');
		return this.data.slice(this.start, this.start + n).toString();
	},
	length: function() {
		return this.end - this.start;
	},
	unget: function(d) {
		require('sys').debug('Ungetting back ' + d.length + ' characters (' + d +')');
		this.start -= (d.length);
	},
	undo: function() {
		require('sys').debug('Throwing back ' + (this.start - this.committed) + ' characters (' + this.data.slice(this.committed, this.start) + ')');
		this.start = this.committed;
	},
	commit: function() {
		this.committed = this.start;
	}
}
