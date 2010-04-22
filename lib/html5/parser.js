var HTML5 = this.HTML5 = require('html5');

var sys = require('sys');

HTML5.debug = function(str) {
	sys.debug(str)
}
require('html5/treebuilder');
require('html5/tokenizer');

var Phase = require('html5/parser/phase').Phase;

HTML5.Parser = Parser = function HTML5Parser(source, options) {
	this.strict = false;
	this.errors = [];
	var phase;

	this.__defineSetter__('phase', function(p) {
		phase = p;
		if(!p) throw("Can't leave phase undefined");
		if(!p instanceof Function) throw("Not a function");
	});

	this.__defineGetter__('phase', function() {
		return phase;
	});

	this.tree = HTML5.TreeBuilder;

	if(options) for(o in options) {
		this[o] = options[o];
	}

	this.tree = new this.tree();

	var that = this;

	new HTML5.Tokenizer(source, function(tokenizer) {
		that.tokenizer = tokenizer;
		that._parse();
		tokenizer.addListener('token', function(token) {
			token = that.normalize_token(token);
			var method = 'process' + token.type;

			HTML5.debug('before ' + method + " " + sys.inspect(token));

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

			HTML5.debug('after ' + method + ": " + sys.inspect(that.tree.open_elements.map(function(f) { return f.nodeName }), false, 1) + " are open");
		});

		tokenizer.addListener('eof', function() {
			that.process_eof();
		});
	});

}

Parser.prototype.newPhase = function(name) {
	HTML5.debug("new phase: " + name);
	this.phase = new PHASES[name](this, this.tree);
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
		this.newPhase('beforeHTML');
		this.phase.insert_html_element();
		this.reset_insertion_mode();
	} else {
		this.inner_html = false;
		this.newPhase('initial');
	}

	this.last_phase = null;

}

Parser.prototype.parse_error = function(code, data) {
	// FIXME: this.errors.push([this.tokenizer.position, code, data]);
	this.errors.push([code, data]);
	if(this.strict) throw(this.errors[this.errors.length - 1]);
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
	} else if(token.type == 'EndTag') {
		if(token.data.length != 0) this.parse_error('attributes-in-end-tag');
		token.name = token.name.toLowerCase();
	}

	return token;
}

Parser.prototype.reset_insert_mode = function() {
	var last = false;
	for(node in this.tree.open_elements.reverse()) {
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
			this.phase = new TAGMODES[node_name](this, this.tree);
		} else if(node_name == 'html') {
			this.phase = new PHASES[(this.tree.head_pointer == null ? 'beforeHead' : 'afterHead')](this, this.tree);
		} else if(last) {
			this.phase = new PHASES.inBody(this, this.tree);
		} else {
			continue;
		}

		break;
	}
}

Parser.prototype._ = function(str) { 
	return(str);
}
