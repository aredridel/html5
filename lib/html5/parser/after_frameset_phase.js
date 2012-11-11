var Phase = require('./phase');
var inBody = require('./in_body_phase');

var start_tag_handlers = {
	html: 'startTagHtml',
	noframes: 'startTagNoframes',
	'-default': 'startTagOther',
}

var end_tag_handlers = {
	html: 'endTagHtml',
	'-default': 'endTagOther',
}

var p = module.exports = function AfterFramesetPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.start_tag_handlers = start_tag_handlers;
	this.end_tag_handlers = end_tag_handlers;
}

p.prototype = new Phase;

p.prototype.processCharacters = function(data) {
	this.parse_error("unexpected-char-after-frameset");
}

p.prototype.startTagNoframes = function(name, attributes) {
	new inBody(this.parser, this.tree).processStartTag(name, attributes);
}

p.prototype.startTagOther = function(name, attributes) {
	this.parse_error("unexpected-start-tag-after-frameset", {name: name});
}

p.prototype.endTagHtml = function(name) {
	this.parser.last_phase = this.parser.phase;
	this.parser.newPhase('trailingEnd');
}

p.prototype.endTagOther = function(name) {
	this.parse_error("unexpected-end-tag-after-frameset", {name: name});
}
