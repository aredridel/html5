var Phase = require('html5/parser/phase').Phase;
exports.Phase = p = function AfterHeadPhase(parser, tree) {
	Phase.call(this, parser, tree);
}

p.prototype = new Phase;

// FIXME handle-start html body frameset ( base link meta script style title) => fromHead
// FIXME handle_end body html br => BodyHtmlBr

p.prototype.process_eof = function() {
	this.anything_else();
	this.parser.phase.process_eof();
}

p.prototype.processCharacters = function(data) {
	this.anything_else();
	this.parser.phase.processCharacters(data);
}

p.prototype.startTagBody = function(name, attributes) {
	this.tree.insert_element(name, attributes);
	this.parser.phase = new PHASES.inBody(this.parser, this.tree);
}

p.prototype.startTagFrameset = function(name, attributes) {
	this.tree.insert_element(name, attributes);
	this.parser.phase = new PHASES.inFrameset(this.parser, this.tree);
}

p.prototype.startTagFromHead = function(name, attributes) {
	this.parse_error("unexpected-start-tag-out-of-my-head", {name: name});
	this.parser.phase = new PHASES.inHead(this.parser, this.tree);
	this.parser.phase.processStartTag(hame, attributes);
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
	this.tree.insert_element('body', {});
	this.parser.phase = new PHASES.inBody(this.parser, this.tree);
}
