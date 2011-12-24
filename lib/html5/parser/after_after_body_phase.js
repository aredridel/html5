var Phase = require('./phase').Phase;
var inBody = require('./in_body_phase').Phase;

var start_tag_handlers = {
	html: 'startTagHtml',
	'-default': 'startTagOther',
}

var p = exports.Phase = function AfterAfterBodyPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.start_tag_handlers = start_tag_handlers;
}

p.prototype = new Phase;

p.prototype.processComment = function(data) {
	this.tree.insert_comment(data);
}

p.prototype.processDoctype = function(data) {
	new inBody(this.parser, this.tree).processDoctype(data);
}

p.prototype.processSpaceCharacters = function(data) {
	new inBody(this.parser, this.tree).processSpaceCharacters(data);
}

p.prototype.startTagHtml = function(data, attributes) {
	new inBody(this.parser, this.tree).startTagHtml(data, attributes);
}

p.prototype.startTagOther = function(name, attributes) {
	this.parse_error('unexpected-start-tag', {name: name});
	this.parser.newPhase('inBody');
	this.parser.phase.processStartTag(name, attributes);
}

p.prototype.endTagOther = function(name) {
	this.parse_error('unexpected-end-tag', {name: name});
	this.parser.newPhase('inBody');
	this.parser.phase.processEndTag(name);
}

p.prototype.processCharacters = function(data) {
	this.parse_error('unexpected-char-after-body');
	this.parser.newPhase('inBody');
	this.parser.phase.processCharacters(data);
}
