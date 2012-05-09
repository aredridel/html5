var HTML5 = exports.HTML5 = require('../html5');

var events = require('events');

require('./treebuilder');
require('./tokenizer');

var Phase = require('./parser/phase').Phase;

var Parser = HTML5.Parser = function HTML5Parser(options) {
	events.EventEmitter.apply(this);
	this.strict = false;
	this.errors = [];
	var phase;

	this.__defineSetter__('phase', function(p) {
		phase = p;
		if(!p) throw( new Error("Can't leave phase undefined"));
		if(!p instanceof Function) throw( new Error("Not a function"));
	});

	this.__defineGetter__('phase', function() {
		return phase;
	});

	if(options) for(var o in options) {
		this[o] = options[o];
	}

	if(!this.document) {
		var l3, jsdom
		jsdom = require('jsdom')
		l3 = jsdom.dom.level3.core
		var DOM = jsdom.browserAugmentation(l3) 
		this.document = new DOM.Document('html');
	}

	this.tree = new HTML5.TreeBuilder(this.document);
}

Parser.prototype = new events.EventEmitter;

Parser.prototype.parse = function(source) {
	if(!source) throw(new Error("No source to parse"));
	HTML5.debug('parser.parse', source)
	this.tokenizer = new HTML5.Tokenizer(source, this.document);
	this.setup();
	this.tokenizer.tokenize();
}

Parser.prototype.parse_fragment = function(source, element) {
	HTML5.debug('parser.parse_fragment', source, element)
	// FIXME: Check to make sure element is inside document
	this.tokenizer = new HTML5.Tokenizer(source, this.document);
	if(element && element.ownerDocument) {
		this.setup(element.tagName, null);
		this.tree.open_elements.push(element);
		this.tree.root_pointer = element;
	} else if(element) {
		this.setup(element, null);
		this.tree.open_elements.push(this.tree.html_pointer);
		this.tree.open_elements.push(this.tree.body_pointer);
		this.tree.root_pointer = this.tree.body_pointer;
	} else {
		this.setup('div', null);
		this.tree.open_elements.push(this.tree.html_pointer);
		this.tree.open_elements.push(this.tree.body_pointer);
		this.tree.root_pointer = this.tree.body_pointer;
	}
	this.tokenizer.tokenize();
}

Object.defineProperty(Parser.prototype, 'fragment', {
	get: function() {
		return this.tree.getFragment();
	}
});

Parser.prototype.newPhase = function(name) {
	this.phase = new HTML5.PHASES[name](this, this.tree);
	HTML5.debug('parser.newPhase', name)
	this.phaseName = name;
}

Parser.prototype.do_token = function(token) {
	var method = 'process' + token.type;

	switch(token.type) {
	case 'Characters':
	case 'SpaceCharacters':
	case 'Comment':
		this.phase[method](token.data);
		break;
	case 'StartTag':
		if (token.name == "script") {
			this.inScript = true;
			this.scriptBuffer = '';
		}
		this.phase[method](token.name, token.data, token.self_closing);
		break;
	case 'EndTag':
		this.phase[method](token.name);
		if (token.name == "script") {
			this.inScript = false;
		}
		break;
	case 'Doctype':
		this.phase[method](token.name, token.publicId, token.systemId, token.correct);
		break;
	case 'EOF':
		this.phase[method]();
		break;
	default:
		this.parse_error(token.data, token.datavars)
	}
}

Parser.prototype.setup = function(container, encoding) {
	this.tokenizer.addListener('token', function(t) { 
		return function(token) { t.do_token(token); };
	}(this));
	this.tokenizer.addListener('end', function(t) { 
		return function() { t.emit('end'); };
	}(this));
	this.emit('setup', this);

	var inner_html = !!container;
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
		case 'script':
			this.tokenizer.content_model = HTML5.Models.SCRIPT_CDATA;
			break;
		case 'style':
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
		this.tree.create_structure_elements(inner_html);
		switch(inner_html) {
		case 'html':
			this.newPhase('afterHtml')
			break;
		case 'head':
			this.newPhase('inHead')
			break;
		default:
			this.newPhase('inBody')
		}
		this.reset_insertion_mode(this.inner_html);
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

Parser.prototype.reset_insertion_mode = function(context) {
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
				node_name = context.tagName;
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
