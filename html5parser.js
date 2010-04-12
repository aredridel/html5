process.mixin(require('html5/constants'));

var TreeBuilder = require('html5/treebuilder').TreeBuilder;
var Tokenizer = require('html5/tokenizer').Tokenizer;

exports.Parser = Parser = function HTML5Parser(source, options) {
	this.strict = false;
	this.errors = [];

	this.tree = TreeBuilder;

	if(options) for(o in options) {
		this[o] = options[o];
	}

	this.tree = new this.tree();

	var that = this;

	this.tokenizer = new Tokenizer(source, function(tokenizer) {
		tokenizer.addListener('token', function(token) {
			token = that.normalize_token(token);
			method = 'process' + token.type;

			switch(token.type) {
			case 'Characters':
			case 'SpaceCharacters':
			case 'Comment':
				that.phase[method](token.data);
				break;
			case 'StartTag':
				that.phase[method](token.name, token.data, token.self_closing);
				break;
			case 'EndTag':
				that.phase[method](token.name);
				break;
			case 'Doctype':
				that.phase[method](token.name, token.publicId, token.systemId, token.correct);
				break;
			default:
				that.parse_error(token.data, token.datavars)
			}
		});

		tokenizer.addListener('eof', function() {
			that.process_eof();
		});
	});


}

Parser.prototype._parse = function(inner_html, encoding, container) {
	container = container || 'div';

	this.tree.reset();
	this.first_start_tag = false;
	this.errors = [];

	// FIXME: instantiate tokenizer and plumb. Pass lowercasing options.

	if(inner_html) {
		this.inner_html = container.toLowerCase();
		switch(this.inner_html) {
		case 'title':
		case 'textarea':
			this.tokenizer.content_model = Models.RCDATA;
			break;
		case 'style':
		case 'script':
		case 'xmp':
		case 'iframe':
		case 'noembed':
		case 'noframes':
		case 'noscript':
			this.tokenizer.content_model = Models.CDATA;
			break;
		case 'plaintext':
			this.tokenizer.content_model = Models.PLAINTEXT;
			break;
		default:
			this.tokenizer.content_model = Models.PCDATA;
		}
		this.phase = PHASES.beforeHTML;
		this.phase.insert_html_element();
		this.reset_insertion_mode();
	} else {
		this.inner_html = false;
		this.phase = PHASES.initial;
	}

	this.last_phase = null;

}

Parser.prototype.parse_error = function(code, data) {
	this.errors.push([this.tokenizer.position, code, data]);
	if(this.strict) throw(this.errors[this.errors.length]);
}

Parser.prototype.normalize_token = function(token) {
	if(token.type == 'EmptyTag') {
		if(VOID_ELEMENTS.indexOf(token.name) == -1) {
			parse_error('incorrectly-placed-solidus');
		}
		token.type = 'StartTag';
	}

	if(token.type == 'StartTag') {
		token.name = token.name.toLowerCase();
		if(token.data.length != 0) {
			var data = {};
			token.data.reverse().forEach(function(e) {
				data[e[0].toLowerCase()] = e[1];
			});
			token.data = data;
		}
	} else if(token.type = 'EndTag') {
		if(token.data.length != 0) parse_error('attributes-in-end-tag');
		token.name = token.name.toLowerCase();
	}

	return token;
}

Parser.prototype.reset_insert_mode = function() {
	var last = false;
	for(node in this.tee.open_elements.reverse()) {
		var node_name = node.name;
		if(node == this.tree.open_elements[0]) {
			last = true;
			if(node_name == 'th' || node_name == 'td') {
				// XXX: assert this.inner_html
				node_name = this.inner_html;
			}
		}

		if(node_name == 'select' || node_name =='colgroup' || node_name == 'head' || node_name == 'frameset') {
			// XXX: assert this.inner_html
		}

		if(TAGMODES[node_name]) {
			this.phase = TAGMODES[node_name];
		} else if(node_name == 'html') {
			this.phase = PHASES[(this.tree.head_pointer == null ? 'beforeHead' : 'afterHead')];
		} else if(last) {
			this.phase = PHASES.inBody;
		} else {
			continue;
		}

		break;
	}
}

Parser.prototype._ = function(str) { 
	return(str);
}
