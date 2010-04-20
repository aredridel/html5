function Buffer() {
	this.data = '';
	this.eof = false;
}

exports.Buffer = Buffer;

Buffer.prototype = {
	matchWhile: function(re) {
		var r = new RegExp("^"+re);
		if(m = r.exec(this.data)) {
			if(!this.eof && m[0].length == this.data.length) throw('drain');
			this.data = this.data.substr(m[0].length);
			return m[0];
		} else {
			return '';
		}
	},
	matchUntil: function(re) {
		if(m = new RegExp(re).exec(this.data)) {
			var t = this.data.substr(0, m.index);
			this.data = this.data.substr(m.index);
			return t;
		} else {
			if(this.eof) return '';
			throw('drain');
		}
	},
	append: function(data) {
		this.data += data;
	},
	shift: function(n) {
		if(!this.eof && this.data.length == 0) throw('drain');
		d = this.data.substr(0, n);
		this.data = this.data.substr(n);
		return d;
	},
	peek: function(n) {
		if(!this.eof && this.data.length < n) throw('drain');
		return this.data.substr(0, n);
	},
	length: function() {
		return this.data.length;
	},
	unget: function(d) {
		this.data = d + this.data;
	}
}
