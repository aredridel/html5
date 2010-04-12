exports.Phase = function Phase(parser, tree) {
	this.tree = tree;
	this.parser = parser;
}

exports.Phase.prototype = {
	parse_error: function(code, options) {
		this.parser.parse_error(code, options);
	}
}
