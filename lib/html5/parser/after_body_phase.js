var Phase = require('./phase').Phase;

var end_tag_handlers = {
	html: 'endTagHtml',
	'-default': 'endTagOther',
}

var p = exports.Phase = function AfterBodyPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.end_tag_handlers = end_tag_handlers;
}

p.prototype = new Phase;

p.prototype.processComment = function(data) {
	// This is needed because data is to be appended to the html element here
	// and not to whatever is currently open.
	this.tree.insert_comment(data, this.tree.open_elements[0]);
}

p.prototype.processCharacters = function(data) {
	this.parse_error('unexpected-char-after-body')
	this.parser.newPhase('inBody')
	this.parser.phase.processCharacters(data)
}

p.prototype.processStartTag = function(name, attributes, self_closing) {
	this.parse_error('unexpected-start-tag-after-body', {name: name});
	this.parser.newPhase('inBody');
	this.parser.phase.processStartTag(name, attributes, self_closing);
}

p.prototype.endTagHtml = function(name) {
	if(this.parser.inner_html) {
		this.parse_error('end-html-in-innerhtml');
	} else {
		// XXX This may need to be done, not sure
		// Don't set last_phase to the current phase but to the inBody phase
		// instead. No need for extra parse_errors if there's something after
		// </html>.
		// Try <!doctype html>X</html>X for instance
		this.parser.last_phase = this.parser.phase;
		this.parser.newPhase('afterAfterBody');
	}
}

p.prototype.endTagOther = function(name) {
	this.parse_error('unexpected-end-tag-after-body', {name: name});
	this.parser.newPhase('inBody');
	this.parser.phase.processEndTag(name);
}
