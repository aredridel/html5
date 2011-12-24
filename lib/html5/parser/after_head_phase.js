var Phase = require('./phase').Phase;
var HTML5 = require('../../html5');

var start_tag_handlers = {
	html: 'startTagHtml',
	body: 'startTagBody',
	frameset: 'startTagFrameset',
	base: 'startTagFromHead',
	link: 'startTagFromHead',
	meta: 'startTagFromHead',
	script: 'startTagFromHead',
	style: 'startTagFromHead',
	title: 'startTagFromHead',
	"-default": 'startTagOther',
};

var end_tag_handlers = {
	body: 'endTagBodyHtmlBr',
	html: 'endTagBodyHtmlBr',
	br: 'endTagBodyHtmlBr',
	"-default": 'endTagOther',
};

var p = exports.Phase = function AfterHeadPhase(parser, tree) {
	Phase.call(this, parser, tree);
        this.start_tag_handlers = start_tag_handlers;
        this.end_tag_handlers = end_tag_handlers;

	this.name = 'after_head_phase';
}

p.prototype = new Phase;


p.prototype.processEOF = function() {
	this.anything_else();
	this.parser.phase.processEOF();
}

p.prototype.processCharacters = function(data) {
	this.anything_else();
	this.parser.phase.processCharacters(data);
}

p.prototype.startTagBody = function(name, attributes) {
	this.tree.insert_element(name, attributes);
	this.parser.newPhase('inBody');
}

p.prototype.startTagFrameset = function(name, attributes) {
	this.tree.insert_element(name, attributes);
	this.parser.newPhase('inFrameset');
}

p.prototype.startTagFromHead = function(name, attributes) {
	this.parse_error("unexpected-start-tag-out-of-my-head", {name: name});
	this.parser.newPhase('inHead');
	this.parser.phase.processStartTag(name, attributes);
}

p.prototype.startTagOther = function(name, attributes) {
	this.anything_else();
	this.parser.phase.processStartTag(name, attributes);
}

p.prototype.endTagBodyHtmlBr = function(name) {
	this.anything_else();
	this.parser.phase.processEndTag(name);
}

p.prototype.endTagOther = function(name) {
	this.parse_error('unexpected-end-tag', {name: name});
}

p.prototype.anything_else = function() {
	this.tree.insert_element('body', []);
	this.parser.newPhase('inBody');
}

p.prototype.processEndTag = function(name) {
	this.anything_else()
	this.parser.phase.processEndTag(name)
}
