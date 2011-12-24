var Phase = require('./phase').Phase;

var start_tag_handlers = {
	html: 'startTagHtml',
	head: 'startTagHead',
	'-default': 'startTagOther',
}

var end_tag_handlers = {
	html: 'endTagImplyHead',
	head: 'endTagImplyHead',
	body: 'endTagImplyHead',
	br: 'endTagImplyHead',
	p: 'endTagImplyHead',
	'-default': 'endTagOther',
}

var p = exports.Phase = function (parser, tree) {
	Phase.call(this, parser, tree);
	this.start_tag_handlers = start_tag_handlers;
	this.end_tag_handlers = end_tag_handlers;
	this.name = 'before_head_phase';
}

p.prototype = new Phase;

p.prototype.processEOF = function() {
	this.startTagHead('head', {});
	this.parser.phase.processEOF();
}

p.prototype.processCharacters = function(data) {
	this.startTagHead('head', {});
	this.parser.phase.processCharacters(data);
}

p.prototype.processSpaceCharacters = function(data) {
}

p.prototype.startTagHead = function(name, attributes) {
	this.tree.insert_element(name, attributes);
	this.tree.head_pointer = this.tree.open_elements.last();
	this.parser.newPhase('inHead');
}

p.prototype.startTagOther = function(name, attributes) {
	this.startTagHead('head', {});
	this.parser.phase.processStartTag(name, attributes);
}

p.prototype.endTagImplyHead = function(name) {
	this.startTagHead('head', {});
	this.parser.phase.processEndTag(name);
}

p.prototype.endTagOther = function(name) {
	this.parse_error('end-tag-after-implied-root', {name: name});
}
