var Phase = require('./phase').Phase;
var inBody = require('./in_body_phase').Phase;

var start_tag_handlers = {
	html: 'startTagHtml',
	frameset: 'startTagFrameset',
	frame: 'startTagFrame',
	noframes: 'startTagNoframes',
	"-default": 'startTagOther'
}

var end_tag_handlers = {
	frameset: 'endTagFrameset',
	noframes: 'endTagNoframes',
	'-default': 'endTagOther',
}

var p = exports.Phase = function InFramesetPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.start_tag_handlers = start_tag_handlers;
	this.end_tag_handlers = end_tag_handlers;
}

p.prototype = new Phase;

p.prototype.processCharacters = function(data) {
	this.parse_error("unexpected-char-in-frameset");
}

p.prototype.startTagFrameset = function(name, attributes) {
	this.tree.insert_element(name, attributes);
}

p.prototype.startTagFrame = function(name, attributes) {
	this.tree.insert_element(name, attributes);
	this.tree.pop_element();
}

p.prototype.startTagNoframes = function(name, attributes) {
	new inBody(this.parser, this.tree).processStartTag(name, attributes);
}

p.prototype.startTagOther = function(name, attributes) {
	this.parse_error("unexpected-start-tag-in-frameset", {name: name});
}

p.prototype.endTagFrameset = function(name, attributes) {
	if(this.tree.open_elements.last().tagName.toLowerCase() == 'html') {
		// inner_html case
		this.parse_error("unexpected-frameset-in-frameset-innerhtml");
	} else {
		this.tree.pop_element();
	}

	if(!this.parser.inner_html && this.tree.open_elements.last().tagName.toLowerCase() != 'frameset') {
		// If we're not in inner_html mode an the current node is not a "frameset" element (anymore) then switch
		this.parser.newPhase('afterFrameset');
	}
}

p.prototype.endTagNoframes = function(name) {
	new inBody(this.parser, this.tree).processEndTag(name);
}

p.prototype.endTagOther = function(name) {
	this.parse_error("unexpected-end-tag-in-frameset", {name: name});
}
