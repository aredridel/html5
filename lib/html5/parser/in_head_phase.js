var Phase = require('./phase').Phase;
var HTML5 = require('../../html5');

var start_tag_handlers = {
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
	"-default": 'startTagOther',
}

var end_tag_handlers = {
	head: 'endTagHead',
	html: 'endTagImplyAfterHead',
	body: 'endTagImplyAfterHead',
	p: 'endTagImplyAfterHead',
	br: 'endTagImplyAfterHead',
	title: 'endTagTitleStyleScriptNoscript',
	style: 'endTagTitleStyleScriptNoscript',
	script: 'endTagTitleStyleScriptNoscript',
	noscript: 'endTagTitleStyleScriptNoscript',
	"-default": 'endTagOther',
}

var p = exports.Phase = function InHeadPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.name = 'in_head_phase';
	this.start_tag_handlers = start_tag_handlers;
	this.end_tag_handlers = end_tag_handlers;
}

p.prototype = new Phase;

p.prototype.processEOF = function() {
	var name = this.tree.open_elements.last().tagName.toLowerCase()
	if(['title', 'style', 'script'].indexOf(name) != -1) {
		this.parse_error("expected-named-closing-tag-but-got-eof", {name: name});
		this.tree.pop_element();
	}

	this.anything_else();

	this.parser.phase.processEOF();
}

p.prototype.processCharacters = function(data) {
	var name = this.tree.open_elements.last().tagName.toLowerCase();
	HTML5.debug('parser.inHead.processCharacters', data);
	if(['title', 'style', 'script', 'noscript'].indexOf(name) != -1) {
		this.tree.insert_text(data);
	} else {
		this.anything_else();
		this.parser.phase.processCharacters(data);
	}
}

p.prototype.startTagHead = function(name, attributes) {
	this.parse_error('two-heads-are-not-better-than-one');
}

p.prototype.startTagTitle = function(name, attributes) {
	var element = this.tree.createElement(name, attributes);
	this.appendToHead(element);
	this.tree.open_elements.push(element);
	this.parser.tokenizer.content_model = HTML5.Models.RCDATA;
}

p.prototype.startTagStyle = function(name, attributes) {
	if(this.tree.head_pointer && this.parser.phaseName == 'inHead') {
		var element = this.tree.createElement(name, attributes);
		this.appendToHead(element);
		this.tree.open_elements.push(element);
	} else {
		this.tree.insert_element(name, attributes);
	}
	this.parser.tokenizer.content_model = HTML5.Models.CDATA;
}

p.prototype.startTagNoScript = function(name, attributes) {
	// XXX Need to decide whether to implement the scripting disabled case
	var element = this.tree.createElement(name, attributes);
	if(this.tree.head_pointer && this.parser.phaseName == 'inHead') {
		this.appendToHead(element);
	} else {
		this.tree.open_elements.last().appendChild(element);
	}
	this.tree.open_elements.push(element);
	this.parser.tokenizer.content_model = HTML5.Models.CDATA;
}

p.prototype.startTagScript = function(name, attributes) {
	// XXX Inner HTML case may be wrong
	var element = this.tree.createElement(name, attributes);
	//element.flags.push('parser-inserted');
	if(this.tree.head_pointer && this.parser.phaseName == 'inHead') {
		this.appendToHead(element);
	} else {
		this.tree.open_elements.last().appendChild(element);
	}
	this.tree.open_elements.push(element);
	this.parser.tokenizer.content_model = HTML5.Models.SCRIPT_CDATA;
}

p.prototype.startTagBaseLinkMeta = function(name, attributes) {
	var element = this.tree.createElement(name, attributes);
	if(this.tree.head_pointer && this.parser.phaseName == 'inHead') {
		this.appendToHead(element);
	} else {
		this.tree.open_elements.last().appendChild(element);
	}
}

p.prototype.startTagOther = function(name, attributes) {
	this.anything_else();
	this.parser.phase.processStartTag(name, attributes);
}

p.prototype.endTagHead = function(name) {
	if(this.tree.open_elements[this.tree.open_elements.length - 1].tagName.toLowerCase() == 'head') {
		this.tree.pop_element()
	} else {
		this.parse_error('unexpected-end-tag', {name: 'head'});
	}
	this.parser.newPhase('afterHead');
}

p.prototype.endTagImplyAfterHead = function(name) {
	this.anything_else();
	this.parser.phase.processEndTag(name);
}

p.prototype.endTagTitleStyleScriptNoscript = function(name) {
	if(this.tree.open_elements[this.tree.open_elements.length - 1].tagName.toLowerCase() == name.toLowerCase()) {
		this.tree.pop_element()
	} else {
		this.parse_error('unexpected-end-tag', {name: name});
	}
}

p.prototype.endTagOther = function(name) {
	this.anything_else();
}

p.prototype.anything_else = function() {
	if(this.tree.open_elements.last().tagName.toLowerCase() == 'head') {
		this.endTagHead('head')
	} else {
		this.parser.newPhase('afterHead');
	}
}

// protected

p.prototype.appendToHead = function(element) {
	if(!this.tree.head_pointer) {
		// FIXME assert(this.parser.inner_html)
		this.tree.open_elements.last().appendChild(element);
	} else {
		this.tree.head_pointer.appendChild(element);
	}
}
