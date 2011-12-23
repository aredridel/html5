var Phase = require('./phase').Phase;

var p = exports.Phase = function TrailingEndPhase(parser, tree) {
	Phase.call(this, parser, tree);
}

p.prototype = new Phase;

p.prototype.processEOF = function() {};

p.prototype.processComment = function(data) {
	this.tree.insert_comment(data);
}

p.prototype.processSpaceCharacters = function(data) {
	this.parser.last_phase.processSpaceCharacters(data);
}

p.prototype.processCharacters = function(data) {
	this.parse_error('expected-eof-but-got-char');
	this.parser.phase = this.parser.last_phase;
	this.parser.phase.processCharacters(data);
}

p.prototype.processStartTag = function(name, attributes) {
	this.parse_error('expected-eof-but-got-start-tag');
	this.parser.phase = this.parser.last_phase;
	this.parser.phase.processStartTag(name, attributes);
}

p.prototype.processEndTag = function(name, attributes) {
	this.parse_error('expected-eof-but-got-end-tag');
	this.parser.phase = this.parser.last_phase;
	this.parser.phase.processEndTag(name);
}
