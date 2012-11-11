var HTML5 = exports.HTML5 = require('../html5');

var events = require('events');

require('./treebuilder');
require('./tokenizer');

var Phase = require('./parser/phase');

var Parser = HTML5.Parser = function HTML5Parser(options) {
	var parser = this;
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

	this.newPhase = function(name) {
		var p = HTML5.PHASES[name];
		if (typeof p == 'function') {
			this.phase = new p(this, this.tree);
		} else {
			this.phase = p;
		}
		HTML5.debug('parser.newPhase', name);
		this.phaseName = name;
	};

	HTML5.PHASES.base = {
		end_tag_handlers: {"-default": 'endTagOther'},
		start_tag_handlers: {"-default": 'startTagOther'},
		parse_error: function(code, options) {
			parser.parse_error(code, options);
		},
		processEOF: function() {
			tree.generateImpliedEndTags();
			if(tree.open_elements.length > 2) {
				parser.parse_error('expected-closing-tag-but-got-eof');
			} else if(tree.open_elements.length == 2 &&
				tree.open_elements[1].tagName.toLowerCase() != 'body') {
				// This happens for framesets or something?
				parser.parse_error('expected-closing-tag-but-got-eof');
			} else if(parser.inner_html && tree.open_elements.length > 1) {
				// XXX This is not what the specification says. Not sure what to do here.
				parser.parse_error('eof-in-innerhtml');
			}
		},
		processComment: function(data) {
			// For most phases the following is correct. Where it's not it will be 
			// overridden.
			tree.insert_comment(data, tree.open_elements.last());
		},
		processDoctype: function(name, publicId, systemId, correct) {
			parser.parse_error('unexpected-doctype');
		},
		processSpaceCharacters: function(data) {
			tree.insert_text(data);
		},
		processStartTag: function(name, attributes, self_closing) {
			if(this[this.start_tag_handlers[name]]) {
				this[this.start_tag_handlers[name]](name, attributes, self_closing);
			} else if(this[this.start_tag_handlers["-default"]]) {
				this[this.start_tag_handlers["-default"]](name, attributes, self_closing);
			} else {
				throw(new Error("No handler found for "+name));
			}
		},
		processEndTag: function(name) {
			if(this[this.end_tag_handlers[name]]) {
				this[this.end_tag_handlers[name]](name);
			} else if(this[this.end_tag_handlers["-default"]]) {
				this[this.end_tag_handlers["-default"]](name);
			} else {
				throw(new Error("No handler found for "+name));
			}
		},
		inScope: function(name, scopingElements) {
			if (!scopingElements) scopingElements = HTML5.SCOPING_ELEMENTS;
			if (!tree.open_elements.length) return false;
			for(var i = tree.open_elements.length - 1; i >= 0; i--) {
				if (!tree.open_elements[i].tagName) return false;
				if(tree.open_elements[i].tagName.toLowerCase() == name) return true;
				if(scopingElements.indexOf(tree.open_elements[i].tagName.toLowerCase()) != -1) return false;
			}
			return false; 
		},
		startTagHtml: function(name, attributes) {
			if (!parser.first_start_tag && name == 'html') {
				parser.parse_error('non-html-root');
			}
			// XXX Need a check here to see if the first start tag token emitted is this token. . . if it's not, invoke parse_error.
			for(var i = 0; i < attributes.length; i++) {
				if(!tree.open_elements[0].getAttribute(attributes[i].nodeName)) {
					tree.open_elements[0].setAttribute(attributes[i].nodeName, attributes[i].nodeValue);
				}
			}
			parser.first_start_tag = false;
		},
		adjust_mathml_attributes: function(attributes) {
			return attributes.map(function(a) {
				if(a[0] =='definitionurl') {
					return ['definitionURL', a[1]];
				} else {
					return a;
				}
			});
		},
		adjust_svg_attributes: function(attributes) {
			return attributes.map(function(a) {
				return HTML5.SVGAttributeMap[a] ? HTML5.SVGAttributeMap[a] : a;
			});
		},
		adjust_foreign_attributes: function (attributes) {
			for(var i = 0; i < attributes.length; i++) {
				if(attributes[i].nodeName.indexOf(':') != -1) {
					var t = attributes[i].nodeName.split(/:/);
					attributes[i].namespace = t[0];
					attributes[i].nodeName = t[1];
				}
			}
			return attributes;
		}
	};

	HTML5.PHASES.initial = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.initial.processEOF = function() {
		parser.parse_error("expected-doctype-but-got-eof");
		parser.newPhase('beforeHTML');
		parser.phase.processEOF();
	};

	HTML5.PHASES.initial.processComment = function(data) {
		tree.insert_comment(data, tree.document);
	};

	HTML5.PHASES.initial.processDoctype = function(name, publicId, systemId, correct) {
		if (name.toLowerCase() != 'html' || publicId || systemId) {
			parser.parse_error("unknown-doctype");
		}

		// XXX need to update DOCTYPE tokens
		tree.insert_doctype(name, publicId, systemId);

		publicId = (publicId || '').toString().toUpperCase();

		if (name.toLowerCase() != 'html') {
			// XXX quirks mode
		} else {
			if ((["+//silmaril//dtd html pro v0r11 19970101//en",
				"-//advasoft ltd//dtd html 3.0 aswedit + extensions//en",
				"-//as//dtd html 3.0 aswedit + extensions//en",
				"-//ietf//dtd html 2.0 level 1//en",
				"-//ietf//dtd html 2.0 level 2//en",
				"-//ietf//dtd html 2.0 strict level 1//en",
				"-//ietf//dtd html 2.0 strict level 2//en",
				"-//ietf//dtd html 2.0 strict//en",
				"-//ietf//dtd html 2.0//en",
				"-//ietf//dtd html 2.1e//en",
				"-//ietf//dtd html 3.0//en",
				"-//ietf//dtd html 3.0//en//",
				"-//ietf//dtd html 3.2 final//en",
				"-//ietf//dtd html 3.2//en",
				"-//ietf//dtd html 3//en",
				"-//ietf//dtd html level 0//en",
				"-//ietf//dtd html level 0//en//2.0",
				"-//ietf//dtd html level 1//en",
				"-//ietf//dtd html level 1//en//2.0",
				"-//ietf//dtd html level 2//en",
				"-//ietf//dtd html level 2//en//2.0",
				"-//ietf//dtd html level 3//en",
				"-//ietf//dtd html level 3//en//3.0",
				"-//ietf//dtd html strict level 0//en",
				"-//ietf//dtd html strict level 0//en//2.0",
				"-//ietf//dtd html strict level 1//en",
				"-//ietf//dtd html strict level 1//en//2.0",
				"-//ietf//dtd html strict level 2//en",
				"-//ietf//dtd html strict level 2//en//2.0",
				"-//ietf//dtd html strict level 3//en",
				"-//ietf//dtd html strict level 3//en//3.0",
				"-//ietf//dtd html strict//en",
				"-//ietf//dtd html strict//en//2.0",
				"-//ietf//dtd html strict//en//3.0",
				"-//ietf//dtd html//en",
				"-//ietf//dtd html//en//2.0",
				"-//ietf//dtd html//en//3.0",
				"-//metrius//dtd metrius presentational//en",
				"-//microsoft//dtd internet explorer 2.0 html strict//en",
				"-//microsoft//dtd internet explorer 2.0 html//en",
				"-//microsoft//dtd internet explorer 2.0 tables//en",
				"-//microsoft//dtd internet explorer 3.0 html strict//en",
				"-//microsoft//dtd internet explorer 3.0 html//en",
				"-//microsoft//dtd internet explorer 3.0 tables//en",
				"-//netscape comm. corp.//dtd html//en",
				"-//netscape comm. corp.//dtd strict html//en",
				"-//o'reilly and associates//dtd html 2.0//en",
				"-//o'reilly and associates//dtd html extended 1.0//en",
				"-//spyglass//dtd html 2.0 extended//en",
				"-//sq//dtd html 2.0 hotmetal + extensions//en",
				"-//sun microsystems corp.//dtd hotjava html//en",
				"-//sun microsystems corp.//dtd hotjava strict html//en",
				"-//w3c//dtd html 3 1995-03-24//en",
				"-//w3c//dtd html 3.2 draft//en",
				"-//w3c//dtd html 3.2 final//en",
				"-//w3c//dtd html 3.2//en",
				"-//w3c//dtd html 3.2s draft//en",
				"-//w3c//dtd html 4.0 frameset//en",
				"-//w3c//dtd html 4.0 transitional//en",
				"-//w3c//dtd html experimental 19960712//en",
				"-//w3c//dtd html experimental 970421//en",
				"-//w3c//dtd w3 html//en",
				"-//w3o//dtd w3 html 3.0//en",
				"-//w3o//dtd w3 html 3.0//en//",
				"-//w3o//dtd w3 html strict 3.0//en//",
				"-//webtechs//dtd mozilla html 2.0//en",
				"-//webtechs//dtd mozilla html//en",
				"-/w3c/dtd html 4.0 transitional/en",
				"html"].indexOf(publicId) != -1) ||
			(!systemId && ["-//w3c//dtd html 4.01 frameset//EN",
				"-//w3c//dtd html 4.01 transitional//EN"].indexOf(publicId) != -1) ||
			(systemId ==
				"http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd")) {
				// XXX quirks mode
			}
		}

		parser.newPhase('beforeHTML');
	};

	HTML5.PHASES.initial.processSpaceCharacters = function(data) {
	};

	HTML5.PHASES.initial.processCharacters = function(data) {
		parser.parse_error('expected-doctype-but-got-chars');
		parser.newPhase('beforeHTML');
		parser.phase.processCharacters(data);
	};

	HTML5.PHASES.initial.processStartTag = function(name, attributes, self_closing) {
		parser.parse_error('expected-doctype-but-got-start-tag', {name: name});
		parser.newPhase('beforeHTML');
		parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.initial.processEndTag = function(name) {
		parser.parse_error('expected-doctype-but-got-end-tag', {name: name});
		parser.newPhase('beforeHTML');
		parser.phase.processEndTag(name);
	};

	HTML5.PHASES.afterAfterBody = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.afterAfterBody.start_tag_handlers = {
		html: 'startTagHtml',
		'-default': 'startTagOther'
	};

	HTML5.PHASES.afterAfterBody.processComment = function(data) {
		tree.insert_comment(data);
	};

	HTML5.PHASES.afterAfterBody.processDoctype = function(data) {
		new HTML5.PHASES.inBody(parser, tree).processDoctype(data);
	};

	HTML5.PHASES.afterAfterBody.processSpaceCharacters = function(data) {
		new HTML5.PHASES.inBody(parser, tree).processSpaceCharacters(data);
	};

	HTML5.PHASES.afterAfterBody.startTagHtml = function(data, attributes) {
		new HTML5.PHASES.inBody(parser, tree).startTagHtml(data, attributes);
	};

	HTML5.PHASES.afterAfterBody.startTagOther = function(name, attributes) {
		parser.parse_error('unexpected-start-tag', {name: name});
		parser.newPhase('inBody');
		parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.afterAfterBody.endTagOther = function(name) {
		parser.parse_error('unexpected-end-tag', {name: name});
		parser.newPhase('inBody');
		parser.phase.processEndTag(name);
	};

	HTML5.PHASES.afterAfterBody.processCharacters = function(data) {
		parser.parse_error('unexpected-char-after-body');
		parser.newPhase('inBody');
		parser.phase.processCharacters(data);
	};

	if (options) for(var o in options) {
		this[o] = options[o];
	}

	if(!this.document) {
		var l3, jsdom;
		jsdom = require('jsdom');
		l3 = jsdom.dom.level3.core;
		var DOM = jsdom.browserAugmentation(l3);
		this.document = new DOM.Document('html');
	}

	var tree = this.tree = new HTML5.TreeBuilder(this.document);
};

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
