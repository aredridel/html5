var buffer = require('buffer');
var HTML5 = require('../html5');

function Buffer() {
	this.data = '';
	this.start = 0;
	this.committed = 0;
	var eof;
	this.__defineSetter__('eof', function(f) {
		eof = f
		HTML5.debug('buffer.eof=', f)
	})
	this.__defineGetter__('eof', function() { return eof })
	this.eof = false;
}

exports.Buffer = Buffer;

Buffer.prototype = {
	slice: function() {
		HTML5.debug('buffer.slice')
		if(this.start >= this.data.length) {
			if(!this.eof) throw HTML5.DRAIN
			return HTML5.EOF;
		}
		return this.data.slice(this.start, this.data.length);
	},
	char: function() {
		HTML5.debug('buffer.char')
		if(!this.eof && this.start >= this.data.length - 1) throw HTML5.DRAIN;
		if(this.start >= this.data.length) {
			return HTML5.EOF;
		}
		return this.data[this.start++];
	},
	advance: function(amount) {
		HTML5.debug('buffer.advance', amount)
		this.start += amount;
		if(this.start >= this.data.length) {	
			if(!this.eof) throw HTML5.DRAIN;
			return HTML5.EOF;
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
		HTML5.debug('buffer.matchWhile', re);
		if(this.eof && this.start >= this.data.length ) return '';
		var r = new RegExp("^"+re+"+");
		var m;
		if(m = r.exec(this.slice())) {
			if(!this.eof && m[0].length == this.data.length - this.start) throw HTML5.DRAIN;
			this.advance(m[0].length);
			return m[0];
		} else {
			return '';
		}
	},
	matchUntil: function(re) {
		var m, s;
		HTML5.debug('buffer.matchUntil', re);
		s = this.slice();
		if(s === HTML5.EOF) {
			return '';
		} else if(m = new RegExp(re + (this.eof ? "|\0|$" : "|\0")).exec(this.slice())) {
			var t = this.data.slice(this.start, this.start + m.index);
			this.advance(m.index);
			return t.toString();
		} else {
			throw HTML5.DRAIN;
		}
	},
	append: function(data) {
		HTML5.debug('buffer.append', data);
		this.data += data
	},
	shift: function(n) {
		HTML5.debug('buffer.shift', n);
		if(!this.eof && this.start + n >= this.data.length) throw HTML5.DRAIN;
		if(this.eof && this.start >= this.data.length) return HTML5.EOF;
		var d = this.data.slice(this.start, this.start + n).toString();
		this.advance(Math.min(n, this.data.length - this.start));
		return d;
	},
	peek: function(n) {
		HTML5.debug('buffer.peek', n)
		if(!this.eof && this.start + n >= this.data.length) throw HTML5.DRAIN;
		if(this.eof && this.start >= this.data.length) return HTML5.EOF;
		return this.data.slice(this.start, Math.min(this.start + n, this.data.length)).toString();
	},
	length: function() {
		HTML5.debug('buffer.length')
		return this.data.length - this.start - 1;
	},
	unget: function(d) {
		HTML5.debug('buffer.unget', d);
		if(d === HTML5.EOF) return;
		this.start -= (d.length);
	},
	undo: function() {
		HTML5.debug('buffer.undo')
		this.start = this.committed;
	},
	commit: function() {
		HTML5.debug('buffer.commit')
		this.committed = this.start;
	}
}
