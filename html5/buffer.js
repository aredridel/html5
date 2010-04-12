function Buffer() {
	this.data = '';
}

exports.Buffer = Buffer;

Buffer.prototype = {
	matchWhile: function(chars) {
		if(m = new RegExp('^[' + chars + ']+').exec(this.data)) {
			this.data = this.data.substr(m[0].length);
			return m[0];
		} else {
			return '';
		}
	},
	matchUntil: function(chars) {
		if(m = new RegExp('^[^'+chars+']+').exec(this.data)) {
			this.data = this.data.substr(m[0].length);
			return m[0];
		} else {
			return '';
		}
	},
	append: function(data) {
		this.data += data;
	},
	shift: function(n) {
		d = this.data.substr(0, n);
		this.data = this.data.substr(n);
		return d;
	},
	peek: function(n) {
		return this.data.substr(0, n);
	},
	length: function() {
		return this.data.length;
	},
	unget: function(d) {
		this.data = d + this.data;
	}

}
