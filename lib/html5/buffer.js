var Buffer = exports.Buffer = function() {
	this.data = '';
	this.start = 0;
	this.committed = 0;
	this.eof = false;
};

Buffer.EOF = -1;

Buffer.DRAIN = -2;

Buffer.prototype = {
	slice: function() {
		if(this.start >= this.data.length) {
			if(!this.eof) throw Buffer.DRAIN;
			return Buffer.EOF;
		}
		return this.data.slice(this.start, this.data.length);
	},
	char: function() {
		if(!this.eof && this.start >= this.data.length - 1) throw Buffer.DRAIN;
		if(this.start >= this.data.length) {
			return Buffer.EOF;
		}
		return this.data[this.start++];
	},
	advance: function(amount) {
		this.start += amount;
		if(this.start >= this.data.length) {
			if(!this.eof) throw Buffer.DRAIN;
			return Buffer.EOF;
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
		if(this.eof && this.start >= this.data.length ) return '';
		var r = new RegExp("^"+re+"+");
		var m = r.exec(this.slice());
		if(m) {
			if(!this.eof && m[0].length == this.data.length - this.start) throw Buffer.DRAIN;
			this.advance(m[0].length);
			return m[0];
		} else {
			return '';
		}
	},
	matchUntil: function(re) {
		var m, s;
		s = this.slice();
		if(s === Buffer.EOF) {
			return '';
		} else if(m = new RegExp(re + (this.eof ? "|$" : "")).exec(s)) {
			var t = this.data.slice(this.start, this.start + m.index);
			this.advance(m.index);
			return t.toString();
		} else {
			throw Buffer.DRAIN;
		}
	},
	append: function(data) {
		this.data += data;
	},
	shift: function(n) {
		if(!this.eof && this.start + n >= this.data.length) throw Buffer.DRAIN;
		if(this.eof && this.start >= this.data.length) return Buffer.EOF;
		var d = this.data.slice(this.start, this.start + n).toString();
		this.advance(Math.min(n, this.data.length - this.start));
		return d;
	},
	peek: function(n) {
		if(!this.eof && this.start + n >= this.data.length) throw Buffer.DRAIN;
		if(this.eof && this.start >= this.data.length) return Buffer.EOF;
		return this.data.slice(this.start, Math.min(this.start + n, this.data.length)).toString();
	},
	length: function() {
		return this.data.length - this.start - 1;
	},
	unget: function(d) {
		if(d === Buffer.EOF) return;
		this.start -= (d.length);
	},
	undo: function() {
		this.start = this.committed;
	},
	commit: function() {
		this.committed = this.start;
	}
};
