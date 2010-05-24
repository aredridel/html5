var HTML5 = exports.HTML5 = require('html5');

require('html5/treebuilder');
require('html5/tokenizer');

var Phase = require('html5/parser/phase').Phase;

var Parser = HTML5.Parser = function HTML5Parser(source, options) {
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
		that._parse(that.inner_html, null, that.inner_html);
		tokenizer.addListener('token', function(token) {
			token = that.normalize_token(token);
			var method = 'process' + token.type;

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
			case 'EOF':
				that.phase[method]();
				break;
			default:
				that.parse_error(token.data, token.datavars)
			}

		});
	});

}

Parser.prototype.newPhase = function(name) {
	this.phase = new PHASES[name](this, this.tree);
	this.phaseName = name;
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
			this.tokenizer.content_model = HTML5.Models.RCDATA;
			break;
		case 'style':
		case 'script':
		case 'xmp':
		case 'iframe':
		case 'noembed':
		case 'noframes':
		case 'noscript':
			this.tokenizer.content_model = HTML5.Models.CDATA;
			break;
		case 'plaintext':
			this.tokenizer.content_model = HTML5.Models.PLAINTEXT;
			break;
		default:
			this.tokenizer.content_model = HTML5.Models.PCDATA;
		}
		this.newPhase('rootElement');
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
	if(this.strict) throw(this.errors.last());
}

Parser.prototype.normalize_token = function(token) {
	if(token.type == 'EmptyTag') {
		if(HTML5.VOID_ELEMENTS.indexOf(token.name) == -1) {
			parse_error('incorrectly-placed-solidus');
		}
		token.type = 'StartTag';
	}

	if(token.type == 'StartTag') {
		token.name = token.name.toLowerCase();
		if(token.data.length != 0) {
			var data = {};
			token.data.reverse();
			token.data.forEach(function(e) {
				data[e[0].toLowerCase()] = e[1];
			});
			token.data = [];
			for(var k in data) {
				token.data.push({nodeName: k, nodeValue: data[k]});
			}
		}
	} else if(token.type == 'EndTag') {
		if(token.data.length != 0) this.parse_error('attributes-in-end-tag');
		token.name = token.name.toLowerCase();
	}

	return token;
}

Parser.prototype.reset_insertion_mode = function() {
	var last = false;

	var node_name;
	
	for(var i = this.tree.open_elements.length - 1; i >= 0; i--) {
		var node = this.tree.open_elements[i]
		node_name = node.tagName.toLowerCase()
		if(node == this.tree.open_elements[0]) {
			last = true
			if(node_name != 'th' && node_name != 'td') {
				// XXX
				// assert.ok(this.inner_html);
				node_name = this.inner_html;
			}
		}

		if(!(node_name == 'select' || node_name == 'colgroup' || node_name == 'head' || node_name == 'frameset')) {
			// XXX
			// assert.ok(this.inner_html)
		}


		if(HTML5.TAGMODES[node_name]) {
			this.newPhase(HTML5.TAGMODES[node_name]);
		} else if(node_name == 'html') {
			this.newPhase(this.tree.head_pointer ? 'afterHead' : 'beforeHead');
		} else if(last) {
			this.newPhase('inBody');
		} else {
			continue;
		}

		break;
	}
}

Parser.prototype._ = function(str) { 
	return(str);
}
