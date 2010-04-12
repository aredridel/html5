var Phase = require('html5/parser/phase').Phase;

var start_tag_handlers = {
	html: 'startTagHtml',
	head: 'startTagHead'
}

var end_tag_handlers = {
	head: 'endTagImplyHead',
	br: 'endTagImplyHead'
}

exports.Phase = p = function (parser, tree) {
	Phase.call(this, parser, tree);
	this.start_tag_handlers = start_tag_handlers;
	this.end_tag_handlers = end_tag_handlers;
	this.name = 'before_head_phase';
}

p.prototype = new Phase;

p.prototype.process_eof = function() {
	this.startTagHead('head', {});
	this.parser.phase.process_eof();
}

p.prototype.processSpaceCharacters = function(data) {
}

p.prototype.processCharacters = function(data) {
	this.startTagHead('head', {});
	this.parser.phase.processCharacters(data);
}

p.prototype.startTagHead = function(name, attributes) {
	this.tree.insert_element(name, attributes);
	this.head_pointer = this.tree.open_elements[this.tree.open_elements.length - 1];
	this.parser.phase = new PHASES.inHead(this.parser, this.tree);
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
	parse_error('end-tag-after-implied-root', {name: name});
}
