var HTML5 = exports.HTML5 = require('../html5');

var events = require('events');

require('./treebuilder');
require('./tokenizer');

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
		HTML5.PHASES.inBody.processDoctype(data);
	};

	HTML5.PHASES.afterAfterBody.processSpaceCharacters = function(data) {
		HTML5.PHASES.inBody.processSpaceCharacters(data);
	};

	HTML5.PHASES.afterAfterBody.startTagHtml = function(data, attributes) {
		HTML5.PHASES.inBody.startTagHtml(data, attributes);
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

	HTML5.PHASES.afterAfterFrameset = {}; /// FIXME

	HTML5.PHASES.afterBody = Object.create(HTML5.PHASES.base);
	
	HTML5.PHASES.afterBody.end_tag_handlers = {
		html: 'endTagHtml',
		'-default': 'endTagOther'
	};

	HTML5.PHASES.afterBody.processComment = function(data) {
		// This is needed because data is to be appended to the html element here
		// and not to whatever is currently open.
		tree.insert_comment(data, tree.open_elements[0]);
	};

	HTML5.PHASES.afterBody.processCharacters = function(data) {
		parser.parse_error('unexpected-char-after-body');
		parser.newPhase('inBody');
		parser.phase.processCharacters(data);
	};

	HTML5.PHASES.afterBody.processStartTag = function(name, attributes, self_closing) {
		parser.parse_error('unexpected-start-tag-after-body', {name: name});
		parser.newPhase('inBody');
		parser.phase.processStartTag(name, attributes, self_closing);
	};

	HTML5.PHASES.afterBody.endTagHtml = function(name) {
		if (parser.inner_html) {
			parser.parse_error('end-html-in-innerhtml');
		} else {
			// XXX This may need to be done, not sure
			// Don't set last_phase to the current phase but to the inBody phase
			// instead. No need for extra parse_errors if there's something after
			// </html>.
			// Try <!doctype html>X</html>X for instance
			parser.last_phase = parser.phase;
			parser.newPhase('afterAfterBody');
		}
	};

	HTML5.PHASES.afterBody.endTagOther = function(name) {
		parser.parse_error('unexpected-end-tag-after-body', {name: name});
		parser.newPhase('inBody');
		parser.phase.processEndTag(name);
	};

	HTML5.PHASES.afterFrameset = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.afterFrameset.start_tag_handlers = {
		html: 'startTagHtml',
		noframes: 'startTagNoframes',
		'-default': 'startTagOther'
	};

	HTML5.PHASES.afterFrameset.end_tag_handlers = {
		html: 'endTagHtml',
		'-default': 'endTagOther'
	};

	HTML5.PHASES.afterFrameset.processCharacters = function(data) {
		parser.parse_error("unexpected-char-after-frameset");
	};

	HTML5.PHASES.afterFrameset.startTagNoframes = function(name, attributes) {
		HTML5.PHASES.inBody.processStartTag(name, attributes);
	};

	HTML5.PHASES.afterFrameset.startTagOther = function(name, attributes) {
		parser.parse_error("unexpected-start-tag-after-frameset", {name: name});
	};

	HTML5.PHASES.afterFrameset.endTagHtml = function(name) {
		parser.last_phase = parser.phase;
		parser.newPhase('trailingEnd');
	};

	HTML5.PHASES.afterFrameset.endTagOther = function(name) {
		parser.parse_error("unexpected-end-tag-after-frameset", {name: name});
	};

	HTML5.PHASES.afterHead = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.afterHead.start_tag_handlers = {
		html: 'startTagHtml',
		body: 'startTagBody',
		frameset: 'startTagFrameset',
		base: 'startTagFromHead',
		link: 'startTagFromHead',
		meta: 'startTagFromHead',
		script: 'startTagFromHead',
		style: 'startTagFromHead',
		title: 'startTagFromHead',
		"-default": 'startTagOther'
	};

	HTML5.PHASES.afterHead.end_tag_handlers = {
		body: 'endTagBodyHtmlBr',
		html: 'endTagBodyHtmlBr',
		br: 'endTagBodyHtmlBr',
		"-default": 'endTagOther'
	};

	HTML5.PHASES.afterHead.processEOF = function() {
		this.anything_else();
		parser.phase.processEOF();
	};

	HTML5.PHASES.afterHead.processCharacters = function(data) {
		this.anything_else();
		parser.phase.processCharacters(data);
	};

	HTML5.PHASES.afterHead.startTagBody = function(name, attributes) {
		tree.insert_element(name, attributes);
		parser.newPhase('inBody');
	};

	HTML5.PHASES.afterHead.startTagFrameset = function(name, attributes) {
		tree.insert_element(name, attributes);
		parser.newPhase('inFrameset');
	};

	HTML5.PHASES.afterHead.startTagFromHead = function(name, attributes) {
		parser.parse_error("unexpected-start-tag-out-of-my-head", {name: name});
		parser.newPhase('inHead');
		parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.afterHead.startTagOther = function(name, attributes) {
		this.anything_else();
		parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.afterHead.endTagBodyHtmlBr = function(name) {
		this.anything_else();
		parser.phase.processEndTag(name);
	};

	HTML5.PHASES.afterHead.endTagOther = function(name) {
		parser.parse_error('unexpected-end-tag', {name: name});
	};

	HTML5.PHASES.afterHead.anything_else = function() {
		tree.insert_element('body', []);
		parser.newPhase('inBody');
	};

	HTML5.PHASES.afterHead.processEndTag = function(name) {
		this.anything_else();
		parser.phase.processEndTag(name);
	};

	HTML5.PHASES.beforeHead = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.beforeHead.start_tag_handlers = {
		html: 'startTagHtml',
		head: 'startTagHead',
		'-default': 'startTagOther'
	};

	HTML5.PHASES.beforeHead.end_tag_handlers = {
		html: 'endTagImplyHead',
		head: 'endTagImplyHead',
		body: 'endTagImplyHead',
		br: 'endTagImplyHead',
		p: 'endTagImplyHead',
		'-default': 'endTagOther'
	};

	HTML5.PHASES.beforeHead.processEOF = function() {
		this.startTagHead('head', {});
		parser.phase.processEOF();
	};

	HTML5.PHASES.beforeHead.processCharacters = function(data) {
		this.startTagHead('head', {});
		parser.phase.processCharacters(data);
	};

	HTML5.PHASES.beforeHead.processSpaceCharacters = function(data) {
	};

	HTML5.PHASES.beforeHead.startTagHead = function(name, attributes) {
		tree.insert_element(name, attributes);
		tree.head_pointer = tree.open_elements.last();
		parser.newPhase('inHead');
	};

	HTML5.PHASES.beforeHead.startTagOther = function(name, attributes) {
		this.startTagHead('head', {});
		parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.beforeHead.endTagImplyHead = function(name) {
		this.startTagHead('head', {});
		parser.phase.processEndTag(name);
	};

	HTML5.PHASES.beforeHead.endTagOther = function(name) {
		parser.parse_error('end-tag-after-implied-root', {name: name});
	};

	HTML5.PHASES.beforeHTML = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.beforeHTML.processEOF = function() {
		this.insert_html_element();
		parser.phase.processEOF();
	};

	HTML5.PHASES.beforeHTML.processComment = function(data) {
		tree.insert_comment(data, tree.document);
	};

	HTML5.PHASES.beforeHTML.processSpaceCharacters = function(data) {
	};

	HTML5.PHASES.beforeHTML.processCharacters = function(data) {
		this.insert_html_element();
		parser.phase.processCharacters(data);
	};

	HTML5.PHASES.beforeHTML.processStartTag = function(name, attributes, self_closing) {
		if(name == 'html') parser.first_start_tag = true;
		this.insert_html_element();
		parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.beforeHTML.processEndTag = function(name) {
		this.insert_html_element();
		parser.phase.processEndTag(name);
	};

	HTML5.PHASES.beforeHTML.insert_html_element = function() {
		var de = tree.document.documentElement;
		if (de) {
			if (de.tagName != 'HTML')
				HTML5.debug('parser.before_html_phase', 'Non-HTML root element!');
			tree.open_elements.push(de);
			while(de.childNodes.length >= 1) de.removeChild(de.firstChild);
		} else {
			var element = tree.createElement('html', []);
			tree.open_elements.push(element);
			tree.document.appendChild(element);
		}
		parser.newPhase('beforeHead');
	};


	HTML5.PHASES.inCaption = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.inCaption.start_tag_handlers = {
		html: 'startTagHtml',
		caption: 'startTagTableElement',
		col: 'startTagTableElement',
		colgroup: 'startTagTableElement',
		tbody: 'startTagTableElement',
		td: 'startTagTableElement',
		tfoot: 'startTagTableElement',
		thead: 'startTagTableElement',
		tr: 'startTagTableElement',
		'-default': 'startTagOther'
	};

	HTML5.PHASES.inCaption.end_tag_handlers = {
		caption: 'endTagCaption',
		table: 'endTagTable',
		body: 'endTagIgnore',
		col: 'endTagIgnore',
		colgroup: 'endTagIgnore',
		html: 'endTagIgnore',
		tbody: 'endTagIgnore',
		td: 'endTagIgnore',
		tfood: 'endTagIgnore',
		thead: 'endTagIgnore',
		tr: 'endTagIgnore',
		'-default': 'endTagOther'
	};

	HTML5.PHASES.inCaption.ignoreEndTagCaption = function() {
		return !this.inScope('caption', HTML5.TABLE_SCOPING_ELEMENTS);
	};

	HTML5.PHASES.inCaption.processCharacters = function(data) {
		HTML5.PHASES.inBody.processCharacters(data);
	};

	HTML5.PHASES.inCaption.startTagTableElement = function(name, attributes) {
		parser.parse_error('unexpected-end-tag', {name: name});
		var ignoreEndTag = this.ignoreEndTagCaption();
		parser.phase.processEndTag('caption');
		if(!ignoreEndTag) parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.inCaption.startTagOther = function(name, attributes) {
		HTML5.PHASES.inBody.processStartTag(name, attributes);
	};

	HTML5.PHASES.inCaption.endTagCaption = function(name) {
		if(this.ignoreEndTagCaption()) {
			// inner_html case
			assert.ok(parser.inner_html);
			parser.parse_error('unexpected-end-tag', {name: name});
		} else {
			// AT this code is quite similar to endTagTable in inTable
			tree.generateImpliedEndTags();
			if (tree.open_elements.last().tagName.toLowerCase() != 'caption') {
				parser.parse_error('expected-one-end-tag-but-got-another', {
					gotName: "caption",
					expectedName: tree.open_elements.last().tagName.toLowerCase()
				});
			}

			tree.remove_open_elements_until('caption');
		
			tree.clearActiveFormattingElements();

			parser.newPhase('inTable');
		}
	};

	HTML5.PHASES.inCaption.endTagTable = function(name) {
		parser.parse_error("unexpected-end-table-in-caption");
		var ignoreEndTag = this.ignoreEndTagCaption();
		parser.phase.processEndTag('caption');
		if(!ignoreEndTag) parser.phase.processEndTag(name);
	};

	HTML5.PHASES.inCaption.endTagIgnore = function(name) {
		parser.parse_error('unexpected-end-tag', {name: name});
	};

	HTML5.PHASES.inCaption.endTagOther = function(name) {
		HTML5.PHASES.inBody.processEndTag(name);
	};


	HTML5.PHASES.inCell = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.inCell.start_tag_handlers = {
		html: 'startTagHtml',
		caption: 'startTagTableOther',
		col: 'startTagTableOther',
		colgroup: 'startTagTableOther',
		tbody: 'startTagTableOther',
		td: 'startTagTableOther',
		tfoot: 'startTagTableOther',
		th: 'startTagTableOther',
		thead: 'startTagTableOther',
		tr: 'startTagTableOther',
		'-default': 'startTagOther'
	};

	HTML5.PHASES.inCell.end_tag_handlers = {
		td: 'endTagTableCell',
		th: 'endTagTableCell',
		body: 'endTagIgnore',
		caption: 'endTagIgnore',
		col: 'endTagIgnore',
		colgroup: 'endTagIgnore',
		html: 'endTagIgnore',
		table: 'endTagImply',
		tbody: 'endTagImply',
		tfoot: 'endTagImply',
		thead: 'endTagImply',
		tr: 'endTagImply',
		'-default': 'endTagOther'
	};

	HTML5.PHASES.inCell.processCharacters = function(data) {
		HTML5.PHASES.inBody.processCharacters(data);
	};

	HTML5.PHASES.inCell.startTagTableOther = function(name, attributes) {
		if(this.inScope('td', HTML5.TABLE_SCOPING_ELEMENTS) || this.inScope('th', HTML5.TABLE_SCOPING_ELEMENTS)) {
			this.closeCell();
			parser.phase.processStartTag(name, attributes);
		} else {
			// inner_html case
			parser.parse_error();
		}
	};

	HTML5.PHASES.inCell.startTagOther = function(name, attributes) {
		HTML5.PHASES.inBody.processStartTag(name, attributes);
	};

	HTML5.PHASES.inCell.endTagTableCell = function(name) {
		if(this.inScope(name, HTML5.TABLE_SCOPING_ELEMENTS)) {
			tree.generateImpliedEndTags(name);
			if(tree.open_elements.last().tagName.toLowerCase() != name.toLowerCase()) {
				parser.parse_error('unexpected-cell-end-tag', {name: name});
				tree.remove_open_elements_until(name);
			} else {
				tree.pop_element();
			}
			tree.clearActiveFormattingElements();
			parser.newPhase('inRow');
		} else {
			parser.parse_error('unexpected-end-tag', {name: name});
		}
	};

	HTML5.PHASES.inCell.endTagIgnore = function(name) {
		parser.parse_error('unexpected-end-tag', {name: name});
	};

	HTML5.PHASES.inCell.endTagImply = function(name) {
		if(this.inScope(name, HTML5.TABLE_SCOPING_ELEMENTS)) {
			this.closeCell();
			parser.phase.processEndTag(name);
		} else {
			// sometimes inner_html case
			parser.parse_error();
		}
	};

	HTML5.PHASES.inCell.endTagOther = function(name) {
		HTML5.PHASES.inBody.processEndTag(name);
	};

	HTML5.PHASES.inCell.closeCell = function() {
		if(this.inScope('td', HTML5.TABLE_SCOPING_ELEMENTS)) {
			this.endTagTableCell('td');
		} else if(this.inScope('th', HTML5.TABLE_SCOPING_ELEMENTS)) {
			this.endTagTableCell('th');
		}
	};


	HTML5.PHASES.inColumnGroup = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.inColumnGroup.start_tag_handlers = {
		html: 'startTagHtml',
		col: 'startTagCol',
		'-default': 'startTagOther'
	};

	HTML5.PHASES.inColumnGroup.end_tag_handlers = {
		colgroup: 'endTagColgroup',
		col: 'endTagCol',
		'-default': 'endTagOther'
	};

	HTML5.PHASES.inColumnGroup.ignoreEndTagColgroup = function() {
		return tree.open_elements.last().tagName.toLowerCase() == 'html';
	};

	HTML5.PHASES.inColumnGroup.processCharacters = function(data) {
		var ignoreEndTag = this.ignoreEndTagColgroup();
		this.endTagColgroup('colgroup');
		if(!ignoreEndTag) parser.phase.processCharacters(data);
	};

	HTML5.PHASES.inColumnGroup.startTagCol = function(name, attributes) {
		tree.insert_element(name, attributes);
		tree.pop_element();
	};

	HTML5.PHASES.inColumnGroup.startTagOther = function(name, attributes) {
		var ignoreEndTag = this.ignoreEndTagColgroup();
		this.endTagColgroup('colgroup');
		if(!ignoreEndTag) parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.inColumnGroup.endTagColgroup = function(name) {
		if(this.ignoreEndTagColgroup()) {
			// inner_html case
			assert.ok(parser.inner_html);
			parser.parse_error();
		} else {
			tree.pop_element();
			parser.newPhase('inTable');
		}
	};

	HTML5.PHASES.inColumnGroup.endTagCol = function(name) {
		parser.parse_error("no-end-tag", {name: 'col'});
	};

	HTML5.PHASES.inColumnGroup.endTagOther = function(name) {
		var ignoreEndTag = this.ignoreEndTagColgroup();
		this.endTagColgroup('colgroup');
		if(!ignoreEndTag) parser.phase.processEndTag(name) ;
	};

	HTML5.PHASES.inForeignContent = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.inForeignContent.start_tag_handlers = {
		'-default': 'startTagOther'
	};

	HTML5.PHASES.inForeignContent.end_tag_handlers = {
		'-default': 'endTagOther'
	};

	HTML5.PHASES.inForeignContent.startTagOther = function(name, attributes, self_closing) {
		if(['mglyph', 'malignmark'].indexOf(name) != -1 &&
			['mi', 'mo', 'mn', 'ms', 'mtext'].indexOf(tree.open_elements.last().tagName) != -1 &&
			tree.open_elements.last().namespace == 'math') {
			parser.secondary_phase.processStartTag(name, attributes);
			if(parser.phase == 'inForeignContent') {
				if(tree.open_elements.any(function(e) { return e.namespace; })) {
					parser.phase = parser.secondary_phase;
				}
			}
		} else if(['b', 'big', 'blockquote', 'body', 'br', 'center', 'code', 'dd', 'div', 'dl', 'dt', 'em', 'embed', 'font', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'i', 'img', 'li', 'listing', 'menu', 'meta', 'nobr', 'ol', 'p', 'pre', 'ruby', 's', 'small', 'span', 'strong', 'strike', 'sub', 'sup', 'table', 'tt', 'u', 'ul', 'var'].indexOf(name) != -1) {
			parser.parse_error('html-in-foreign-content', {name: name});
			while(tree.open_elements.last().namespace) {
				tree.open_elements.pop();
			}
			parser.phase = parser.secondary_phase;
			parser.phase.processStartTag(name, attributes);
		} else {
			if(tree.open_elements.last().namespace == 'math') {
				attributes = this.adjust_mathml_attributes(attributes);
			}
			attributes = this.adjust_foreign_attributes(attributes);
			tree.insert_foreign_element(name, attributes, tree.open_elements.last().namespace);
			if(self_closing) tree.open_elements.pop();
		}
	};

	HTML5.PHASES.inForeignContent.endTagOther = function(name) {
		parser.secondary_phase.processEndTag(name);
		if(parser.phase == 'inForeignContent') {
			if(tree.open_elements.any(function(e) { return e.namespace; })) {
				parser.phase = parser.secondary_phase;
			}
		}
	};

	HTML5.PHASES.inForeignContent.processCharacters = function(characters) {
		tree.insert_text(characters);
	};

	HTML5.PHASES.inFrameset = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.inFrameset.start_tag_handlers = {
		html: 'startTagHtml',
		frameset: 'startTagFrameset',
		frame: 'startTagFrame',
		noframes: 'startTagNoframes',
		"-default": 'startTagOther'
	};

	HTML5.PHASES.inFrameset.end_tag_handlers = {
		frameset: 'endTagFrameset',
		noframes: 'endTagNoframes',
		'-default': 'endTagOther'
	};

	HTML5.PHASES.inFrameset.processCharacters = function(data) {
		parser.parse_error("unexpected-char-in-frameset");
	};

	HTML5.PHASES.inFrameset.startTagFrameset = function(name, attributes) {
		tree.insert_element(name, attributes);
	};

	HTML5.PHASES.inFrameset.startTagFrame = function(name, attributes) {
		tree.insert_element(name, attributes);
		tree.pop_element();
	};

	HTML5.PHASES.inFrameset.startTagNoframes = function(name, attributes) {
		HTML5.PHASES.inBody.processStartTag(name, attributes);
	};

	HTML5.PHASES.inFrameset.startTagOther = function(name, attributes) {
		parser.parse_error("unexpected-start-tag-in-frameset", {name: name});
	};

	HTML5.PHASES.inFrameset.endTagFrameset = function(name, attributes) {
		if(tree.open_elements.last().tagName.toLowerCase() == 'html') {
			// inner_html case
			parser.parse_error("unexpected-frameset-in-frameset-innerhtml");
		} else {
			tree.pop_element();
		}

		if(!parser.inner_html && tree.open_elements.last().tagName.toLowerCase() != 'frameset') {
			// If we're not in inner_html mode an the current node is not a "frameset" element (anymore) then switch
			parser.newPhase('afterFrameset');
		}
	};

	HTML5.PHASES.inFrameset.endTagNoframes = function(name) {
		HTML5.PHASES.inBody.processEndTag(name);
	};

	HTML5.PHASES.inFrameset.endTagOther = function(name) {
		parser.parse_error("unexpected-end-tag-in-frameset", {name: name});
	};


	HTML5.PHASES.inHead = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.inHead.start_tag_handlers = {
		html: 'startTagHtml',
		head: 'startTagHead',
		title: 'startTagTitle',
		type: 'startTagType',
		style: 'startTagStyle',
		script: 'startTagScript',
		noscript: 'startTagNoScript',
		base: 'startTagBaseLinkMeta',
		link: 'startTagBaseLinkMeta',
		meta: 'startTagBaseLinkMeta',
		"-default": 'startTagOther'
	};

	HTML5.PHASES.inHead.end_tag_handlers = {
		head: 'endTagHead',
		html: 'endTagImplyAfterHead',
		body: 'endTagImplyAfterHead',
		p: 'endTagImplyAfterHead',
		br: 'endTagImplyAfterHead',
		title: 'endTagTitleStyleScriptNoscript',
		style: 'endTagTitleStyleScriptNoscript',
		script: 'endTagTitleStyleScriptNoscript',
		noscript: 'endTagTitleStyleScriptNoscript',
		"-default": 'endTagOther'
	};

	HTML5.PHASES.inHead.processEOF = function() {
		var name = tree.open_elements.last().tagName.toLowerCase();
		if(['title', 'style', 'script'].indexOf(name) != -1) {
			parser.parse_error("expected-named-closing-tag-but-got-eof", {name: name});
			tree.pop_element();
		}

		this.anything_else();

		parser.phase.processEOF();
	};

	HTML5.PHASES.inHead.processCharacters = function(data) {
		var name = tree.open_elements.last().tagName.toLowerCase();
		HTML5.debug('parser.inHead.processCharacters', data);
		if(['title', 'style', 'script', 'noscript'].indexOf(name) != -1) {
			tree.insert_text(data);
		} else {
			this.anything_else();
			parser.phase.processCharacters(data);
		}
	};

	HTML5.PHASES.inHead.startTagHead = function(name, attributes) {
		parser.parse_error('two-heads-are-not-better-than-one');
	};

	HTML5.PHASES.inHead.startTagTitle = function(name, attributes) {
		var element = tree.createElement(name, attributes);
		this.appendToHead(element);
		tree.open_elements.push(element);
		parser.tokenizer.content_model = HTML5.Models.RCDATA;
	};

	HTML5.PHASES.inHead.startTagStyle = function(name, attributes) {
		if (tree.head_pointer && parser.phaseName == 'inHead') {
			var element = tree.createElement(name, attributes);
			this.appendToHead(element);
			tree.open_elements.push(element);
		} else {
			tree.insert_element(name, attributes);
		}
		parser.tokenizer.content_model = HTML5.Models.CDATA;
	};

	HTML5.PHASES.inHead.startTagNoScript = function(name, attributes) {
		// XXX Need to decide whether to implement the scripting disabled case
		var element = tree.createElement(name, attributes);
		if(tree.head_pointer && parser.phaseName == 'inHead') {
			this.appendToHead(element);
		} else {
			tree.open_elements.last().appendChild(element);
		}
		tree.open_elements.push(element);
		parser.tokenizer.content_model = HTML5.Models.CDATA;
	};

	HTML5.PHASES.inHead.startTagScript = function(name, attributes) {
		// XXX Inner HTML case may be wrong
		var element = tree.createElement(name, attributes);
		//element.flags.push('parser-inserted');
		if(tree.head_pointer && parser.phaseName == 'inHead') {
			this.appendToHead(element);
		} else {
			tree.open_elements.last().appendChild(element);
		}
		tree.open_elements.push(element);
		parser.tokenizer.content_model = HTML5.Models.SCRIPT_CDATA;
	};

	HTML5.PHASES.inHead.startTagBaseLinkMeta = function(name, attributes) {
		var element = tree.createElement(name, attributes);
		if(tree.head_pointer && parser.phaseName == 'inHead') {
			this.appendToHead(element);
		} else {
			tree.open_elements.last().appendChild(element);
		}
	};

	HTML5.PHASES.inHead.startTagOther = function(name, attributes) {
		this.anything_else();
		parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.inHead.endTagHead = function(name) {
		if(tree.open_elements[tree.open_elements.length - 1].tagName.toLowerCase() == 'head') {
			tree.pop_element();
		} else {
			parser.parse_error('unexpected-end-tag', {name: 'head'});
		}
		parser.newPhase('afterHead');
	};

	HTML5.PHASES.inHead.endTagImplyAfterHead = function(name) {
		this.anything_else();
		parser.phase.processEndTag(name);
	};

	HTML5.PHASES.inHead.endTagTitleStyleScriptNoscript = function(name) {
		if (tree.open_elements[tree.open_elements.length - 1].tagName.toLowerCase() == name.toLowerCase()) {
			tree.pop_element();
		} else {
			parser.parse_error('unexpected-end-tag', {name: name});
		}
	};

	HTML5.PHASES.inHead.endTagOther = function(name) {
		this.anything_else();
	};

	HTML5.PHASES.inHead.anything_else = function() {
		if(tree.open_elements.last().tagName.toLowerCase() == 'head') {
			this.endTagHead('head');
		} else {
			parser.newPhase('afterHead');
		}
	};

	// protected

	HTML5.PHASES.inHead.appendToHead = function(element) {
		if(!tree.head_pointer) {
			// FIXME assert(parser.inner_html)
			tree.open_elements.last().appendChild(element);
		} else {
			tree.head_pointer.appendChild(element);
		}
	};


	HTML5.PHASES.inTable = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.inTable.start_tag_handlers = {
		html: 'startTagHtml',
		caption: 'startTagCaption',
		colgroup: 'startTagColgroup',
		col: 'startTagCol',
		table: 'startTagTable',
		tbody: 'startTagRowGroup',
		tfoot: 'startTagRowGroup',
		thead: 'startTagRowGroup',
		td: 'startTagImplyTbody',
		th: 'startTagImplyTbody',
		tr: 'startTagImplyTbody',
		'-default': 'startTagOther'
	};

	HTML5.PHASES.inTable.end_tag_handlers = {
		table: 'endTagTable',
		body: 'endTagIgnore',
		caption: 'endTagIgnore',
		col: 'endTagIgnore',
		colgroup: 'endTagIgnore',
		html: 'endTagIgnore',
		tbody: 'endTagIgnore',
		td: 'endTagIgnore',
		tfoot: 'endTagIgnore',
		th: 'endTagIgnore',
		thead: 'endTagIgnore',
		tr: 'endTagIgnore',
		'-default': 'endTagOther'
	};

	HTML5.PHASES.inTable.processCharacters =  function(data) {
		parser.parse_error("unexpected-char-implies-table-voodoo");
		tree.insert_from_table = true;
		HTML5.PHASES.inBody.processCharacters(data);
		tree.insert_from_table = false;
	};

	HTML5.PHASES.inTable.startTagCaption = function(name, attributes) {
		this.clearStackToTableContext();
		tree.activeFormattingElements.push(HTML5.Marker);
		tree.insert_element(name, attributes);
		parser.newPhase('inCaption');
	};

	HTML5.PHASES.inTable.startTagColgroup = function(name, attributes) {
		this.clearStackToTableContext();
		tree.insert_element(name, attributes);
		parser.newPhase('inColumnGroup');
	};

	HTML5.PHASES.inTable.startTagCol = function(name, attributes) {
		this.startTagColgroup('colgroup', {});
		parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.inTable.startTagRowGroup = function(name, attributes) {
		this.clearStackToTableContext();
		tree.insert_element(name, attributes);
		parser.newPhase('inTableBody');
	};

	HTML5.PHASES.inTable.startTagImplyTbody = function(name, attributes) {
		this.startTagRowGroup('tbody', {});
		parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.inTable.startTagTable = function(name, attributes) {
		parser.parse_error("unexpected-start-tag-implies-end-tag",
				{startName: "table", endName: "table"});
		parser.phase.processEndTag('table');
		if(!parser.inner_html) parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.inTable.startTagOther = function(name, attributes) {
		this.parse_error("unexpected-start-tag-implies-table-voodoo", {name: name});
		tree.insert_from_table = true;
		HTML5.PHASES.inBody.processStartTag(name, attributes);
		tree.insert_from_table = false;
	};

	HTML5.PHASES.inTable.endTagTable = function(name) {
		if(this.inScope(name, HTML5.TABLE_SCOPING_ELEMENTS)) {
			tree.generateImpliedEndTags();
			if(tree.open_elements.last().tagName.toLowerCase() != name) {
				parser.parse_error("end-tag-too-early-named", {gotName: 'table', expectedName: tree.open_elements.last().tagName.toLowerCase()});
			}

			tree.remove_open_elements_until('table');
			parser.reset_insertion_mode(tree.open_elements.last());
		} else {
			assert.ok(parser.inner_html);
			parser.parse_error();
		}
	};

	HTML5.PHASES.inTable.endTagIgnore = function(name) {
		parser.parse_error("unexpected-end-tag", {name: name});
	};

	HTML5.PHASES.inTable.endTagOther = function(name) {
		parser.parse_error("unexpected-end-tag-implies-table-voodoo", {name: name});
		// Make all the special element rearranging voodoo kick in
		tree.insert_from_table = true;
		// Process the end tag in the "in body" mode
		HTML5.PHASES.inBody.processEndTag(name);
		tree.insert_from_table = false;
	};

	HTML5.PHASES.inTable.clearStackToTableContext = function() {
		var name;
		while(name = tree.open_elements.last().tagName.toLowerCase(), (name != 'table' && name != 'html')) {
			parser.parse_error("unexpected-implied-end-tag-in-table", {name: name});
			tree.pop_element();
		}
		// When the current node is <html> it's an inner_html case
	};

	HTML5.PHASES.inTableBody = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.inTableBody.start_tag_handlers = {
		html: 'startTagHtml',
		tr: 'startTagTr',
		td: 'startTagTableCell',
		th: 'startTagTableCell',
		caption: 'startTagTableOther',
		col: 'startTagTableOther',
		colgroup: 'startTagTableOther',
		tbody: 'startTagTableOther',
		tfoot: 'startTagTableOther',
		thead: 'startTagTableOther',
		'-default': 'startTagOther'
	};

	HTML5.PHASES.inTableBody.end_tag_handlers = {
		table: 'endTagTable',
		tbody: 'endTagTableRowGroup',
		tfoot: 'endTagTableRowGroup',
		thead: 'endTagTableRowGroup',
		body: 'endTagIgnore',
		caption: 'endTagIgnore',
		col: 'endTagIgnore',
		colgroup: 'endTagIgnore',
		html: 'endTagIgnore',
		td: 'endTagIgnore',
		th: 'endTagIgnore',
		tr: 'endTagIgnore',
		'-default': 'endTagOther'
	};

	HTML5.PHASES.inTableBody.processCharacters = function(data) {
		HTML5.PHASES.inTable.processCharacters(data);
	};

	HTML5.PHASES.inTableBody.startTagTr = function(name, attributes) {
		this.clearStackToTableBodyContext();
		tree.insert_element(name, attributes);
		parser.newPhase('inRow');
	};

	HTML5.PHASES.inTableBody.startTagTableCell = function(name, attributes) {
		parser.parse_error("unexpected-cell-in-table-body", {name: name});
		this.startTagTr('tr', {});
		parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.inTableBody.startTagTableOther = function(name, attributes) {
		// XXX any ideas on how to share this with endTagTable
		if(this.inScope('tbody', HTML5.TABLE_SCOPING_ELEMENTS) ||  this.inScope('thead', HTML5.TABLE_SCOPING_ELEMENTS) || this.inScope('tfoot', HTML5.TABLE_SCOPING_ELEMENTS)) {
			this.clearStackToTableBodyContext();
			this.endTagTableRowGroup(tree.open_elements.last().tagName.toLowerCase());
			parser.phase.processStartTag(name, attributes);
		} else {
			// inner_html case
			parser.parse_error();
		}
	};
	
	HTML5.PHASES.inTableBody.startTagOther = function(name, attributes) {
		HTML5.PHASES.inTable.processStartTag(name, attributes);
	};

	HTML5.PHASES.inTableBody.endTagTableRowGroup = function(name) {
		if(this.inScope(name, HTML5.TABLE_SCOPING_ELEMENTS)) {
			this.clearStackToTableBodyContext();
			tree.pop_element();
			parser.newPhase('inTable');
		} else {
			parser.parse_error('unexpected-end-tag-in-table-body', {name: name});
		}
	};

	HTML5.PHASES.inTableBody.endTagTable = function(name) {
		if(this.inScope('tbody', HTML5.TABLE_SCOPING_ELEMENTS) || this.inScope('thead', HTML5.TABLE_SCOPING_ELEMENTS) || this.inScope('tfoot', HTML5.TABLE_SCOPING_ELEMENTS)) {
			this.clearStackToTableBodyContext();
			this.endTagTableRowGroup(tree.open_elements.last().tagName.toLowerCase());
			parser.phase.processEndTag(name);
		} else {
			// inner_html case
			this.parse_error();
		}
	};

	HTML5.PHASES.inTableBody.endTagIgnore = function(name) {
		parser.parse_error("unexpected-end-tag-in-table-body", {name: name});
	};

	HTML5.PHASES.inTableBody.endTagOther = function(name) {
		HTML5.PHASES.inTable.processEndTag(name);
	};

	HTML5.PHASES.inTableBody.clearStackToTableBodyContext = function() {
		var name;
		while(name = tree.open_elements.last().tagName.toLowerCase(), name != 'tbody' && name != 'tfoot' && name != 'thead' && name != 'html') {
			parser.parse_error("unexpected-implied-end-tag-in-table", {name: name});
			tree.pop_element();
		}
	};

	HTML5.PHASES.inSelect = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.inSelect.start_tag_handlers = {
		html: 'startTagHtml',
		option: 'startTagOption',
		optgroup: 'startTagOptgroup',
		select: 'startTagSelect',
		'-default': 'startTagOther'
	};

	HTML5.PHASES.inSelect.end_tag_handlers = {
		option: 'endTagOption',
		optgroup: 'endTagOptgroup',
		select: 'endTagSelect',
		caption: 'endTagTableElements',
		table: 'endTagTableElements',
		tbody: 'endTagTableElements',
		tfoot: 'endTagTableElements',
		thead: 'endTagTableElements',
		tr: 'endTagTableElements',
		td: 'endTagTableElements',
		th: 'endTagTableElements',
		'-default': 'endTagOther'
	};
	
	HTML5.PHASES.inSelect.processCharacters = function(data) {
		tree.insert_text(data);
	};

	HTML5.PHASES.inSelect.startTagOption = function(name, attributes) {
		// we need to imply </option> if <option> is the current node
		if(tree.open_elements.last().tagName.toLowerCase() == 'option') tree.pop_element();
		tree.insert_element(name, attributes);
	};

	HTML5.PHASES.inSelect.startTagOptgroup = function(name, attributes) {
		if(tree.open_elements.last().tagName.toLowerCase() == 'option') tree.pop_element();
		if(tree.open_elements.last().tagName.toLowerCase() == 'optgroup') tree.pop_element();
		tree.insert_element(name, attributes);
	};
	
	HTML5.PHASES.inSelect.endTagOption = function(name) {
		if(tree.open_elements.last().tagName.toLowerCase() == 'option') {
			tree.pop_element();
		} else {
			parser.parse_error('unexpected-end-tag-in-select', {name: 'option'});
		}
	};

	HTML5.PHASES.inSelect.endTagOptgroup = function(name) {
		// </optgroup> implicitly closes <option>
		if(tree.open_elements.last().tagName.toLowerCase() == 'option' && tree.open_elements[tree.open_elements.length - 2].tagName.toLowerCase() == 'optgroup') {
			tree.pop_element();
		}

		// it also closes </optgroup>
		if(tree.open_elements.last().tagName.toLowerCase() == 'optgroup') {
			tree.pop_element();
		} else {
			// But nothing else
			parser.parse_error('unexpected-end-tag-in-select', {name: 'optgroup'});
		}
	};

	HTML5.PHASES.inSelect.startTagSelect = function(name) {
		parser.parse_error("unexpected-select-in-select");
		this.endTagSelect('select');
	};

	HTML5.PHASES.inSelect.endTagSelect = function(name) {
		if(this.inScope('select', HTML5.TABLE_SCOPING_ELEMENTS)) {
			tree.remove_open_elements_until('select');
			parser.reset_insertion_mode(tree.open_elements.last());
		} else {
			// inner_html case
			parser.parse_error();
		}
	};

	HTML5.PHASES.inSelect.endTagTableElements = function(name) {
		parser.parse_error('unexpected-end-tag-in-select', {name: name});
		
		if(this.inScope(name, HTML5.TABLE_SCOPING_ELEMENTS)) {
			this.endTagSelect('select');
			parser.phase.processEndTag(name);
		}
	};

	HTML5.PHASES.inSelect.startTagOther = function(name, attributes) {
		parser.parse_error("unexpected-start-tag-in-select", {name: name});
	};

	HTML5.PHASES.inSelect.endTagOther = function(name) {
		parser.parse_error('unexpected-end-tag-in-select', {name: name});
	};

	HTML5.PHASES.inSelectInTable = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.inSelectInTable.start_tag_handlers = {
		caption: 'startTagTable',
		table: 'startTagTable',
		tbody: 'startTagTable',
		tfoot: 'startTagTable',
		thead: 'startTagTable',
		tr: 'startTagTable',
		td: 'startTagTable',
		th: 'startTagTable',
		'-default': 'startTagOther'
	};

	HTML5.PHASES.inSelectInTable.end_tag_handlers = {
		caption: 'endTagTable',
		table: 'endTagTable',
		tbody: 'endTagTable',
		tfoot: 'endTagTable',
		thead: 'endTagTable',
		tr: 'endTagTable',
		td: 'endTagTable',
		th: 'endTagTable',
		'-default': 'endTagOther'
	};

	HTML5.PHASES.inSelectInTable.processCharacters = function(data) {
		HTML5.PHASES.inSelect.processCharacters(data);
	};

	HTML5.PHASES.inSelectInTable.startTagTable = function(name, attributes) {
		parser.parse_error("unexpected-table-element-start-tag-in-select-in-table", {name: name});
		this.endTagOther("select");
		parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.inSelectInTable.startTagOther = function(name, attributes) {
		HTML5.PHASES.inSelect.processStartTag(name, attributes);
	};

	HTML5.PHASES.inSelectInTable.endTagTable = function(name) {
		parser.parse_error("unexpected-table-element-end-tag-in-select-in-table", {name: name});
		if(this.inScope(name, HTML5.TABLE_SCOPING_ELEMENTS)) {
			this.endTagOther("select");
			parser.phase.processEndTag(name);
		}
	};

	HTML5.PHASES.inSelectInTable.endTagOther = function(name) {
		HTML5.PHASES.inSelect.processEndTag(name);
	};

	HTML5.PHASES.inRow = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.inRow.start_tag_handlers = {
		html: 'startTagHtml',
		td: 'startTagTableCell',
		th: 'startTagTableCell',
		caption: 'startTagTableOther',
		col: 'startTagTableOther',
		colgroup: 'startTagTableOther',
		tbody: 'startTagTableOther',
		tfoot: 'startTagTableOther',
		thead: 'startTagTableOther',
		tr: 'startTagTableOther',
		'-default': 'startTagOther'
	};

	HTML5.PHASES.inRow.end_tag_handlers = {
		tr: 'endTagTr',
		table: 'endTagTable',
		tbody: 'endTagTableRowGroup',
		tfoot: 'endTagTableRowGroup',
		thead: 'endTagTableRowGroup',
		body: 'endTagIgnore',
		caption: 'endTagIgnore',
		col: 'endTagIgnore',
		colgroup: 'endTagIgnore',
		html: 'endTagIgnore',
		td: 'endTagIgnore',
		th: 'endTagIgnore',
		'-default': 'endTagOther'
	};

	HTML5.PHASES.inRow.processCharacters = function(data) {
		HTML5.PHASES.inTable.processCharacters(data);
	};

	HTML5.PHASES.inRow.startTagTableCell = function(name, attributes) {
		this.clearStackToTableRowContext();
		tree.insert_element(name, attributes);
		parser.newPhase('inCell');
		tree.activeFormattingElements.push(HTML5.Marker);
	};

	HTML5.PHASES.inRow.startTagTableOther = function(name, attributes) {
		var ignoreEndTag = this.ignoreEndTagTr();
		this.endTagTr('tr');
		// XXX how are we sure it's always ignored in the inner_html case?
		if(!ignoreEndTag) parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.inRow.startTagOther = function(name, attributes) {
		HTML5.PHASES.inTable.processStartTag(name, attributes);
	};

	HTML5.PHASES.inRow.endTagTr = function(name) {
		if(this.ignoreEndTagTr()) {
			assert.ok(parser.inner_html);
			parser.parse_error();
		} else {
			this.clearStackToTableRowContext();
			tree.pop_element();
			parser.newPhase('inTableBody');
		}
	};

	HTML5.PHASES.inRow.endTagTable = function(name) {
		var ignoreEndTag = this.ignoreEndTagTr();
		this.endTagTr('tr');
		// Reprocess the current tag if the tr end tag was not ignored
		// XXX how are we sure it's always ignored in the inner_html case?
		if(!ignoreEndTag) parser.phase.processEndTag(name);
	};

	HTML5.PHASES.inRow.endTagTableRowGroup = function(name) {
		if(this.inScope(name, HTML5.TABLE_SCOPING_ELEMENTS)) {
			this.endTagTr('tr');
			parser.phase.processEndTag(name);
		} else {
			// inner_html case
			parser.parse_error();
		}
	};

	HTML5.PHASES.inRow.endTagIgnore = function(name) {
		parser.parse_error("unexpected-end-tag-in-table-row", {name: name});
	};

	HTML5.PHASES.inRow.endTagOther = function(name) {
		HTML5.PHASES.inTable.processEndTag(name);
	};

	HTML5.PHASES.inRow.clearStackToTableRowContext = function() {
		var name;
		while(name = tree.open_elements.last().tagName.toLowerCase(), (name != 'tr' && name != 'html')) {
			parser.parse_error("unexpected-implied-end-tag-in-table-row", {name: name});
			tree.pop_element();
		}
	};

	HTML5.PHASES.inRow.ignoreEndTagTr = function() {
		return !this.inScope('tr', HTML5.TABLE_SCOPING_ELEMENTS);
	};

	HTML5.PHASES.rootElement = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.rootElement.processEOF = function() {
		this.insert_html_element();
		parser.phase.processEOF();
	};

	HTML5.PHASES.rootElement.processComment = function(data) {
		tree.insert_comment(data, this.tree.document);
	};

	HTML5.PHASES.rootElement.processSpaceCharacters = function(data) {
	};

	HTML5.PHASES.rootElement.processCharacters = function(data) {
		this.insert_html_element();
		parser.phase.processCharacters(data);
	};

	HTML5.PHASES.rootElement.processStartTag = function(name, attributes) {
		if(name == 'html') parser.first_start_tag = true;
		this.insert_html_element();
		parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.rootElement.processEndTag = function(name) {
		this.insert_html_element();
		parser.phase.processEndTag(name);
	};

	HTML5.PHASES.rootElement.insert_html_element = function() {
		var element = tree.createElement('html', {});
		tree.open_elements.push(element);
		tree.document.appendChild(element);
		parser.newPhase('beforeHead');
	};

	HTML5.PHASES.trailingEnd = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.trailingEnd.processEOF = function() {};

	HTML5.PHASES.trailingEnd.processComment = function(data) {
		tree.insert_comment(data);
	};

	HTML5.PHASES.trailingEnd.processSpaceCharacters = function(data) {
		parser.last_phase.processSpaceCharacters(data);
	};

	HTML5.PHASES.trailingEnd.processCharacters = function(data) {
		parser.parse_error('expected-eof-but-got-char');
		parser.phase = parser.last_phase;
		parser.phase.processCharacters(data);
	};

	HTML5.PHASES.trailingEnd.processStartTag = function(name, attributes) {
		parser.parse_error('expected-eof-but-got-start-tag');
		parser.phase = parser.last_phase;
		parser.phase.processStartTag(name, attributes);
	};

	HTML5.PHASES.trailingEnd.processEndTag = function(name, attributes) {
		parser.parse_error('expected-eof-but-got-end-tag');
		parser.phase = parser.last_phase;
		parser.phase.processEndTag(name);
	};

	HTML5.PHASES.inBody = Object.create(HTML5.PHASES.base);

	HTML5.PHASES.inBody.start_tag_handlers = {
		html: 'startTagHtml',
		head: 'startTagMisplaced',
		base: 'startTagProcessInHead',
		link: 'startTagProcessInHead',
		meta: 'startTagProcessInHead',
		script: 'startTagProcessInHead',
		style: 'startTagProcessInHead',
		title: 'startTagTitle',
		body: 'startTagBody',
		form: 'startTagForm',
		plaintext: 'startTagPlaintext',
		a: 'startTagA',
		button: 'startTagButton',
		xmp: 'startTagXmp',
		table: 'startTagTable',
		hr: 'startTagHr',
		image: 'startTagImage',
		input: 'startTagInput',
		textarea: 'startTagTextarea',
		select: 'startTagSelect',
		isindex: 'startTagIsindex',
		applet:	'startTagAppletMarqueeObject',
		marquee:	'startTagAppletMarqueeObject',
		object:	'startTagAppletMarqueeObject',
		li: 'startTagListItem',
		dd: 'startTagListItem',
		dt: 'startTagListItem',
		address: 'startTagCloseP',
		blockquote: 'startTagCloseP',
		center: 'startTagCloseP',
		dir: 'startTagCloseP',
		div: 'startTagCloseP',
		dl: 'startTagCloseP',
		fieldset: 'startTagCloseP',
		listing: 'startTagCloseP',
		menu: 'startTagCloseP',
		ol: 'startTagCloseP',
		p: 'startTagCloseP',
		pre: 'startTagCloseP', /// @todo: Handle <pre> and <listing> specially with regards to newlines
		ul: 'startTagCloseP',
		b: 'startTagFormatting',
		big: 'startTagFormatting',
		em: 'startTagFormatting',
		font: 'startTagFormatting',
		i: 'startTagFormatting',
		s: 'startTagFormatting',
		small: 'startTagFormatting',
		strike: 'startTagFormatting',
		strong: 'startTagFormatting',
		tt: 'startTagFormatting',
		u: 'startTagFormatting',
		nobr: 'startTagNobr',
		area: 'startTagVoidFormatting',
		basefont: 'startTagVoidFormatting',
		bgsound: 'startTagVoidFormatting',
		br: 'startTagVoidFormatting',
		embed: 'startTagVoidFormatting',
		img: 'startTagVoidFormatting',
		param: 'startTagVoidFormatting',
		spacer: 'startTagVoidFormatting',
		wbr: 'startTagVoidFormatting',
		iframe: 'startTagCdata',
		noembed: 'startTagCdata',
		noframes: 'startTagCdata',
		noscript: 'startTagCdata',
		h1: 'startTagHeading',
		h2: 'startTagHeading',
		h3: 'startTagHeading',
		h4: 'startTagHeading',
		h5: 'startTagHeading',
		h6: 'startTagHeading',
		caption: 'startTagMisplaced',
		col: 'startTagMisplaced',
		colgroup: 'startTagMisplaced',
		frame: 'startTagMisplaced',
		frameset: 'startTagMisplaced',
		tbody: 'startTagMisplaced',
		td: 'startTagMisplaced',
		tfoot: 'startTagMisplaced',
		th: 'startTagMisplaced',
		thead: 'startTagMisplaced',
		tr: 'startTagMisplaced',
		option: 'startTagMisplaced',
		optgroup: 'startTagMisplaced',
		'event-source': 'startTagNew',
		section: 'startTagNew',
		nav: 'startTagNew',
		article: 'startTagNew',
		aside: 'startTagNew',
		header: 'startTagNew',
		footer: 'startTagNew',
		datagrid: 'startTagNew',
		command: 'startTagNew',
		math: 'startTagMath',
		svg: 'startTagSVG',
		rt: 'startTagRpRt',
		rp: 'startTagRpRt',
		"-default": 'startTagOther'
	};

	HTML5.PHASES.inBody.end_tag_handlers = {
		p: 'endTagP',
		body: 'endTagBody',
		html: 'endTagHtml',
		form: 'endTagForm',
		applet: 'endTagAppletButtonMarqueeObject',
		button: 'endTagAppletButtonMarqueeObject',
		marquee: 'endTagAppletButtonMarqueeObject',
		object: 'endTagAppletButtonMarqueeObject',
		dd: 'endTagListItem',
		dt: 'endTagListItem',
		li: 'endTagListItem',
		address: 'endTagBlock',
		blockquote: 'endTagBlock',
		center: 'endTagBlock',
		div: 'endTagBlock',
		dl: 'endTagBlock',
		fieldset: 'endTagBlock',
		listing: 'endTagBlock',
		menu: 'endTagBlock',
		ol: 'endTagBlock',
		pre: 'endTagBlock',
		ul: 'endTagBlock',
		h1: 'endTagHeading',
		h2: 'endTagHeading',
		h3: 'endTagHeading',
		h4: 'endTagHeading',
		h5: 'endTagHeading',
		h6: 'endTagHeading',
		a: 'endTagFormatting',
		b: 'endTagFormatting',
		big: 'endTagFormatting',
		em: 'endTagFormatting',
		font: 'endTagFormatting',
		i: 'endTagFormatting',
		nobr: 'endTagFormatting',
		s: 'endTagFormatting',
		small: 'endTagFormatting',
		strike: 'endTagFormatting',
		strong: 'endTagFormatting',
		tt: 'endTagFormatting',
		u: 'endTagFormatting',
		head: 'endTagMisplaced',
		frameset: 'endTagMisplaced',
		select: 'endTagMisplaced',
		optgroup: 'endTagMisplaced',
		option: 'endTagMisplaced',
		table: 'endTagMisplaced',
		caption: 'endTagMisplaced',
		colgroup: 'endTagMisplaced',
		col: 'endTagMisplaced',
		thead: 'endTagMisplaced',
		tfoot: 'endTagMisplaced',
		tbody: 'endTagMisplaced',
		tr: 'endTagMisplaced',
		td: 'endTagMisplaced',
		th: 'endTagMisplaced',
		br: 'endTagBr',
		area: 'endTagNone',
		basefont: 'endTagNone',
		bgsound: 'endTagNone',
		embed: 'endTagNone',
		hr: 'endTagNone',
		image: 'endTagNone',
		img: 'endTagNone',
		input: 'endTagNone',
		isindex: 'endTagNone',
		param: 'endTagNone',
		spacer: 'endTagNone',
		wbr: 'endTagNone',
		frame: 'endTagNone',
		noframes:	'endTagCdataTextAreaXmp',
		noscript:	'endTagCdataTextAreaXmp',
		noembed:	'endTagCdataTextAreaXmp',
		textarea:	'endTagCdataTextAreaXmp',
		xmp:	'endTagCdataTextAreaXmp',
		iframe:	'endTagCdataTextAreaXmp',
		'event-source': 'endTagNew',
		section: 'endTagNew',
		nav: 'endTagNew',
		article: 'endTagNew',
		aside: 'endTagNew',
		header: 'endTagNew',
		footer: 'endTagNew',
		datagrid: 'endTagNew',
		command: 'endTagNew',
		title: 'endTagTitle',
		"-default": 'endTagOther'
	};

	HTML5.PHASES.inBody.processSpaceCharactersDropNewline = function(data) {
		this.dropNewline = false;
		var lastTag = tree.open_elements.last().tagName.toLowerCase();
		if(data.length > 0 && data[0] == "\n" && ('pre' == lastTag || 'textarea' == lastTag) && !tree.open_elements.last().hasChildNodes()) {
			data = data.slice(1);
		}

		if (data.length > 0) {
			tree.reconstructActiveFormattingElements();
			tree.insert_text(data);
		}
	};

	HTML5.PHASES.inBody.processSpaceCharacters = function(data) {
		if (this.dropNewline) {
			this.processSpaceCharactersDropNewline(data);
		} else {
			this.processSpaceCharactersNonPre(data);
		}
	};

	HTML5.PHASES.inBody.processSpaceCharactersNonPre = function(data) {
		tree.reconstructActiveFormattingElements();
		tree.insert_text(data);
	};

	HTML5.PHASES.inBody.processCharacters = function(data) {
		// XXX The specification says to do this for every character at the moment,
		// but apparently that doesn't match the real world so we don't do it for
		// space characters.
		tree.reconstructActiveFormattingElements();
		tree.insert_text(data);
	};

	HTML5.PHASES.inBody.startTagProcessInHead = function(name, attributes) {
		HTML5.PHASES.inHead.processStartTag(name, attributes);
	};

	HTML5.PHASES.inBody.startTagBody = function(name, attributes) {
		parser.parse_error('unexpected-start-tag', {name: 'body'});
		if (tree.open_elements.length == 1 ||
			tree.open_elements[1].tagName.toLowerCase() != 'body') {
			assert.ok(parser.inner_html);
		} else {
			for(var i = 0; i < attributes.length; i++) {
				if(!tree.open_elements[1].getAttribute(attributes[i].nodeName)) {
					tree.open_elements[1].setAttribute(attributes[i].nodeName, attributes[i].nodeValue);
				}
			}
		}
	};

	HTML5.PHASES.inBody.startTagCloseP = function(name, attributes) {
		if (this.inScope('p', HTML5.BUTTON_SCOPING_ELEMENTS)) this.endTagP('p');
		tree.insert_element(name, attributes);
		if (name == 'pre') {
			this.dropNewline = true;
		}
	};

	HTML5.PHASES.inBody.startTagForm = function(name, attributes) {
		if (tree.formPointer) {
			parser.parse_error('unexpected-start-tag', {name: name});
		} else {
			if (this.inScope('p', HTML5.BUTTON_SCOPING_ELEMENTS)) this.endTagP('p');
			tree.insert_element(name, attributes);
			tree.formPointer = tree.open_elements.last();
		}
	};

	HTML5.PHASES.inBody.startTagRpRt = function(name, attributes) {
		if(this.inScope('ruby')) {
			tree.generateImpliedEndTags();
			if(tree.open_elements.last().tagName.toLowerCase() != 'ruby') {
				parser.parse_error('unexpected child of ruby');
				while(tree.open_elements.last().tagName.toLowerCase() != 'ruby') tree.pop_element();
			}
		}
		this.startTagOther(name, attributes);
	};

	HTML5.PHASES.inBody.startTagListItem = function(name, attributes) {
		/// @todo: Fix according to current spec. http://www.w3.org/TR/html5/tree-construction.html#parsing-main-inbody
		var stopNames = {li: ['li'], dd: ['dd', 'dt'], dt: ['dd', 'dt']};
		var stopName = stopNames[name];

		var els = tree.open_elements;
		for(var i = els.length - 1; i >= 0; i--) {
			var node = els[i];
			if(stopName.indexOf(node.tagName.toLowerCase()) != -1) {
				var poppedNodes = [];
				while(els.length - 1 >= i) {
					poppedNodes.push(els.pop());
				}
				if(poppedNodes.length >= 1) {
					parser.parse_error(poppedNodes.length == 1 ? "missing-end-tag" : "missing-end-tags",
						{name: poppedNodes.slice(0).map(function (n) { return n.name; }).join(', ')});
				}
				break;
			}

			// Phrasing eliments are all non special, non scoping, non
			// formatting elements
			if(HTML5.SPECIAL_ELEMENTS.concat(HTML5.SCOPING_ELEMENTS).indexOf(node.tagName.toLowerCase()) != -1 && (node.tagName.toLowerCase() != 'address' && node.tagName.toLowerCase() != 'div')) break;
		}
		if(this.inScope('p', HTML5.BUTTON_SCOPING_ELEMENTS)) this.endTagP('p');

		// Always insert an <li> element
		tree.insert_element(name, attributes);
	};

	HTML5.PHASES.inBody.startTagPlaintext = function(name, attributes) {
		if(this.inScope('p', HTML5.BUTTON_SCOPING_ELEMENTS)) this.endTagP('p');
		tree.insert_element(name, attributes);
		parser.tokenizer.content_model = HTML5.Models.PLAINTEXT;
	};

	HTML5.PHASES.inBody.startTagHeading = function(name, attributes) {
		if (this.inScope('p', HTML5.BUTTON_SCOPING_ELEMENTS)) this.endTagP('p');
		if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(tree.open_elements.last().tagName) != -1) {
			parser.parse_error('heading in heading');
			tree.pop_element();
		}

		tree.insert_element(name, attributes);
	};

	HTML5.PHASES.inBody.startTagA = function(name, attributes) {
		var afeAElement;
		if(afeAElement = tree.elementInActiveFormattingElements('a')) {
			parser.parse_error("unexpected-start-tag-implies-end-tag", {startName: "a", endName: "a"});
			this.endTagFormatting('a');
			var pos;
			pos = tree.open_elements.indexOf(afeAElement);
			if(pos != -1) tree.open_elements.splice(pos, 1);
			pos = tree.activeFormattingElements.indexOf(afeAElement);
			if(pos != -1) tree.activeFormattingElements.splice(pos, 1);
		}
		tree.reconstructActiveFormattingElements();
		this.addFormattingElement(name, attributes);
	};

	HTML5.PHASES.inBody.startTagFormatting = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		this.addFormattingElement(name, attributes);
	};

	HTML5.PHASES.inBody.startTagNobr = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		if(this.inScope('nobr')) {
			parser.parse_error("unexpected-start-tag-implies-end-tag", {startName: 'nobr', endName: 'nobr'});
			this.processEndTag('nobr');
		}
		this.addFormattingElement(name, attributes);
	};

	HTML5.PHASES.inBody.startTagButton = function(name, attributes) {
		if(this.inScope('button')) {
			parser.parse_error('unexpected-start-tag-implies-end-tag', {startName: 'button', endName: 'button'});
			this.processEndTag('button');
			parser.phase.processStartTag(name, attributes);
		} else {
			tree.reconstructActiveFormattingElements();
			tree.insert_element(name, attributes);
			/// @todo set frameset-ok flag to false
			/// @todo is the marker needed anymore?
			tree.activeFormattingElements.push(HTML5.Marker);
		}
	};

	HTML5.PHASES.inBody.startTagAppletMarqueeObject = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		tree.insert_element(name, attributes);
		tree.activeFormattingElements.push(HTML5.Marker);
	};

	HTML5.PHASES.inBody.endTagAppletButtonMarqueeObject = function(name) {
		if(!this.inScope(name)) {
			parser.parse_error("unexpected-end-tag", {name: name});
		} else {
			tree.generateImpliedEndTags();
			if(tree.open_elements.last().tagName.toLowerCase() != name) {
				parser.parse_error('end-tag-too-early', {name: name});
			}
			tree.remove_open_elements_until(name);
			tree.clearActiveFormattingElements();
		}
	};

	HTML5.PHASES.inBody.startTagXmp = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		tree.insert_element(name, attributes);
		parser.tokenizer.content_model = HTML5.Models.CDATA;
	};

	HTML5.PHASES.inBody.startTagTable = function(name, attributes) {
		if (this.inScope('p')) this.processEndTag('p');
		tree.insert_element(name, attributes);
		parser.newPhase('inTable');
	};

	HTML5.PHASES.inBody.startTagVoidFormatting = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		tree.insert_element(name, attributes);
		tree.pop_element();
	};

	HTML5.PHASES.inBody.startTagHr = function(name, attributes) {
		if (this.inScope('p')) this.endTagP('p');
		tree.insert_element(name, attributes);
		tree.pop_element();
	};

	HTML5.PHASES.inBody.startTagImage = function(name, attributes) {
		// No, really...
		parser.parse_error('unexpected-start-tag-treated-as', {originalName: 'image', newName: 'img'});
		this.processStartTag('img', attributes);
	};

	HTML5.PHASES.inBody.startTagInput = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		tree.insert_element(name, attributes);
		if (tree.formPointer) {
			// XXX Not sure what to do here
		}
		tree.pop_element();
	};

	HTML5.PHASES.inBody.startTagIsindex = function(name, attributes) {
		parser.parse_error('deprecated-tag', {name: 'isindex'});
		if(tree.formPointer) return;
		this.processStartTag('form');
		this.processStartTag('hr');
		this.processStartTag('p');
		this.processStartTag('label');
		this.processCharacters("This is a searchable index. Insert your search keywords here: ");
		attributes.push({nodeName: 'name', nodeValue: 'isindex'});
		this.processStartTag('input', attributes);
		this.processEndTag('label');
		this.processEndTag('p');
		this.processStartTag('hr');
		this.processEndTag('form');
	};

	HTML5.PHASES.inBody.startTagTextarea = function(name, attributes) {
		// XXX Form element pointer checking here as well...
		tree.insert_element(name, attributes);
		parser.tokenizer.content_model = HTML5.Models.RCDATA;
		this.dropNewline = true;
	};

	HTML5.PHASES.inBody.startTagCdata = function(name, attributes) {
		tree.insert_element(name, attributes);
		parser.tokenizer.content_model = HTML5.Models.CDATA;
	};

	HTML5.PHASES.inBody.startTagSelect = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		tree.insert_element(name, attributes);
		
		var phaseName = parser.phaseName;
		if (phaseName == 'inTable' ||
			phaseName == 'inCaption' ||
			phaseName == 'inColumnGroup' ||
			phaseName == 'inTableBody' ||
			phaseName == 'inRow' ||
			phaseName == 'inCell') {
			parser.newPhase('inSelectInTable');
		} else {
			parser.newPhase('inSelect');
		}
	};

	HTML5.PHASES.inBody.startTagMisplaced = function(name, attributes) {
		parser.parse_error('unexpected-start-tag-ignored', {name: name});
	};

	HTML5.PHASES.inBody.endTagMisplaced = function(name) {
		// This handles elements with end tags in other insertion modes.
		parser.parse_error("unexpected-end-tag", {name: name});
	};

	HTML5.PHASES.inBody.endTagBr = function(name) {
		parser.parse_error("unexpected-end-tag-treated-as", {originalName: "br", newName: "br element"});
		tree.reconstructActiveFormattingElements();
		tree.insert_element(name, []);
		tree.pop_element();
	};

	HTML5.PHASES.inBody.startTagOptionOptgroup = function(name, attributes) {
		if (this.inScope('option')) this.endTagOther('option');
		tree.reconstructActiveFormattingElements();
		tree.insert_element(name, attributes);
	};

	HTML5.PHASES.inBody.startTagNew = function(name, attributes) {	
		this.startTagOther(name, attributes);
	};

	HTML5.PHASES.inBody.startTagOther = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		tree.insert_element(name, attributes);
	};

	HTML5.PHASES.inBody.startTagTitle = function(name, attributes) {
		tree.insert_element(name, attributes);
		parser.tokenizer.content_model = HTML5.Models.RCDATA;
	};

	HTML5.PHASES.inBody.endTagTitle = function(name, attributes) {
		if(tree.open_elements[tree.open_elements.length - 1].tagName.toLowerCase() == name.toLowerCase()) {
			tree.pop_element();
			parser.tokenizer.content_model = HTML5.Models.PCDATA;
		} else {
			parser.parse_error('unexpected-end-tag', {name: name});
		}
	};

	HTML5.PHASES.inBody.endTagOther = function endTagOther(name) {
		var nodes = tree.open_elements;
		for(var eli = nodes.length - 1; eli > 0; eli--) {
			var currentNode = nodes[eli];
			if(nodes[eli].tagName.toLowerCase() == name) {
				tree.generateImpliedEndTags();
				if(tree.open_elements.last().tagName.toLowerCase() != name) {
					parser.parse_error('unexpected-end-tag', {name: name});
				}
				
				tree.remove_open_elements_until(function(el) {
					return el == currentNode;
				});

				break;
			} else {

				if(HTML5.SPECIAL_ELEMENTS.concat(HTML5.SCOPING_ELEMENTS).indexOf(nodes[eli].tagName.toLowerCase()) != -1) {
					parser.parse_error('unexpected-end-tag', {name: name});   
					break;
				}
			}
		}
	};

	HTML5.PHASES.inBody.startTagMath = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		attributes = this.adjust_mathml_attributes(attributes);
		attributes = this.adjust_foreign_attributes(attributes);
		tree.insert_foreign_element(name, attributes, 'math');
		if (false) {
			// If the token has its self-closing flag set, pop the current node off
			// the stack of open elements and acknowledge the token's self-closing flag
		} else {
			parser.secondary_phase = parser.phase;
			parser.newPhase('inForeignContent');
		}
	};

	HTML5.PHASES.inBody.startTagSVG = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		attributes = this.adjust_svg_attributes(attributes);
		attributes = this.adjust_foreign_attributes(attributes);
		tree.insert_foreign_element(name, attributes, 'svg');
		if(false) {
			// If the token has its self-closing flag set, pop the current node off
			// the stack of open elements and acknowledge the token's self-closing flag
		} else {
			parser.secondary_phase = parser.phase;
			parser.newPhase('inForeignContent');
		}
	};

	HTML5.PHASES.inBody.endTagP = function(name) {
		if(!this.inScope('p', HTML5.BUTTON_SCOPING_ELENENTS)) {
			parser.parse_error('unexpected-end-tag', {name: 'p'});
			this.startTagCloseP('p', {});
			this.endTagP('p');
		} else {
			tree.generateImpliedEndTags('p');
			if (tree.open_elements.last().tagName.toLowerCase() != 'p')
				parser.parse_error('unexpected-end-tag', {name: 'p'});
			tree.remove_open_elements_until(name);
		}
	};

	HTML5.PHASES.inBody.endTagBody = function(name) {
		if(!this.inScope('body')) {
			parser.parse_error('unexpected-end-tag', {name: 'body'});
			return;
		}

		/// @todo Emit parse error on end tags other than the ones listed in http://www.w3.org/TR/html5/tree-construction.html#parsing-main-inbody
		if(tree.open_elements.last().tagName.toLowerCase() != 'body') {
			parser.parse_error('expected-one-end-tag-but-got-another', {
				expectedName: 'body',
				gotName: tree.open_elements.last().tagName.toLowerCase()
			});
		}
		parser.newPhase('afterBody');
	};

	HTML5.PHASES.inBody.endTagHtml = function(name) {
		this.endTagBody(name);
		if(!this.inner_html) parser.phase.processEndTag(name);
	};

	HTML5.PHASES.inBody.endTagBlock = function(name) {
		if(!this.inScope(name)) {
			parser.parse_error('end-tag-for-tag-not-in-scope', {name: name});
		} else {
			tree.generateImpliedEndTags();
			if(tree.open_elements.last().tagName.toLowerCase() != 'name') {
				parser.parse_error('end-tag-too-early', {name: name});
			}
			tree.remove_open_elements_until(name);
		}
	};

	HTML5.PHASES.inBody.endTagForm = function(name)  {
		var node = tree.formPointer;
		tree.formPointer = null;
		if(!node || !this.inScope(name)) {
			parser.parse_error('end-tag-for-tag-not-in-scope', {name: name});
		} else {
			tree.generateImpliedEndTags();
		
			if(tree.open_elements.last().tagName.toLowerCase() != name) {
				parser.parse_error('end-tag-too-early-ignored', {name: 'form'});
			} else {
				tree.pop_element();
				/// @todo the spec is a bit vague here. Remove node from the stack -- what if it's in the middle?
			}
		}
	};

	HTML5.PHASES.inBody.endTagListItem = function(name) {
		if(!this.inScope(name, HTML5.LIST_SCOPING_ELEMENTS)) {
			parser.parse_error('wrong-end-tag-ignored', {name: name});
		} else {
			tree.generateImpliedEndTags(name);
			if(tree.open_elements.last().tagName.toLowerCase() != name)
				parser.parse_error('end-tag-too-early', {name: name});
			tree.remove_open_elements_until(name);
		}
	};

	HTML5.PHASES.inBody.endTagHeading = function(name) {
		var error = true;
		var i;

		for(i in HTML5.HEADING_ELEMENTS) {
			var el = HTML5.HEADING_ELEMENTS[i];
			if(this.inScope(el)) {
				error = false;
				break;
			}
		}
		if(error) {
			parser.parse_error('wrong-end-tag-ignored', {name: name});
			return;
		}

		tree.generateImpliedEndTags();

		if(tree.open_elements.last().tagName.toLowerCase() != name)
			parser.parse_error('end-tag-too-early', {name: name});

		tree.remove_open_elements_until(function(e) {
			return HTML5.HEADING_ELEMENTS.indexOf(e.tagName.toLowerCase()) != -1;
		});
	};

	HTML5.PHASES.inBody.endTagFormatting = function(name) {
		while(true) {
			var afeElement = tree.elementInActiveFormattingElements(name);
			if(!afeElement || (tree.open_elements.indexOf(afeElement) != -1
				&& !this.inScope(afeElement.tagName.toLowerCase()))) {
				parser.parse_error('adoption-agency-1.1', {name: name});
				return;
			} else if(tree.open_elements.indexOf(afeElement) == -1) {
				parser.parse_error('adoption-agency-1.2', {name: name});
				tree.activeFormattingElements.splice(tree.activeFormattingElements.indexOf(afeElement), 1);
				return;
			}

			if(afeElement != tree.open_elements.last()) {
				parser.parse_error('adoption-agency-1.3', {name: name});
			}
			
			// Start of the adoption agency algorithm proper
			var afeIndex = tree.open_elements.indexOf(afeElement);
			var furthestBlock = null;
			var els = tree.open_elements.slice(afeIndex);
			var len = els.length;
			for(var i = 0; i < len; i++) {
				var element = els[i];
				if(HTML5.SPECIAL_ELEMENTS.concat(HTML5.SCOPING_ELEMENTS).indexOf(element.tagName.toLowerCase()) != -1) {
					furthestBlock = element;
					break;
				}
			}
			
			if(!furthestBlock) {
				var element = tree.remove_open_elements_until(function(el) {
					return el == afeElement;
				});
				tree.activeFormattingElements.splice(tree.activeFormattingElements.indexOf(element), 1);
				return;
			}


			var commonAncestor = tree.open_elements[afeIndex - 1];

			var bookmark = tree.activeFormattingElements.indexOf(afeElement);

			var lastNode;
			var node;
			var clone;
			lastNode = node = furthestBlock;

			while(true) {
				node = tree.open_elements[tree.open_elements.indexOf(node) - 1];
				while(tree.activeFormattingElements.indexOf(node) == -1) {
					var tmpNode = node;
					node = tree.open_elements[tree.open_elements.indexOf(node) - 1];
					tree.open_elements.splice(tree.open_elements.indexOf(tmpNode), 1);
				}

				if(node == afeElement) break;

				if(lastNode == furthestBlock) {
					bookmark = tree.activeFormattingElements.indexOf(node) + 1;
				}

				var cite = node.parentNode;

				if(node.hasChildNodes()) {
					clone = node.cloneNode();
					tree.activeFormattingElements[tree.activeFormattingElements.indexOf(node)] = clone;
					tree.open_elements[tree.open_elements.indexOf(node)] = clone;
					node = clone;
				}

				if(lastNode.parent) lastNode.parent.removeChild(lastNode);
				node.appendChild(lastNode);
				lastNode = node;

			}

			if(lastNode.parent) lastNode.parent.removeChild(lastNode);
			commonAncestor.appendChild(lastNode);

			clone = afeElement.cloneNode();

			tree.reparentChildren(furthestBlock, clone);

			furthestBlock.appendChild(clone);

			tree.activeFormattingElements.splice(tree.activeFormattingElements.indexOf(afeElement), 1);
			tree.activeFormattingElements.splice(Math.min(bookmark, tree.activeFormattingElements.length), 0, clone);

			tree.open_elements.splice(tree.open_elements.indexOf(afeElement), 1);
			tree.open_elements.splice(tree.open_elements.indexOf(furthestBlock) + 1, 0, clone);

		}
	};

	HTML5.PHASES.inBody.addFormattingElement = function(name, attributes) {
		tree.insert_element(name, attributes);
		tree.activeFormattingElements.push(tree.open_elements.last());
	}

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
