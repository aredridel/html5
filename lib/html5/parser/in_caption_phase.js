var Phase = require('./phase').Phase;
var inBody = require('./in_body_phase').Phase;
var assert = require('assert');
var HTML5 = require('../../html5');

var starts = {
	html: 'startTagHtml',
	caption: 'startTagTableElement',
	col: 'startTagTableElement',
	colgroup: 'startTagTableElement',
	tbody: 'startTagTableElement',
	td: 'startTagTableElement',
	tfoot: 'startTagTableElement',
	thead: 'startTagTableElement',
	tr: 'startTagTableElement',
	'-default': 'startTagOther'
}

var ends = {
	caption: 'endTagCaption',
	table: 'endTagTable',
	body: 'endTagIgnore',
	col: 'endTagIgnore',
	colgroup: 'endTagIgnore',
	html: 'endTagIgnore',
	tbody: 'endTagIgnore',
	td: 'endTagIgnore',
	tfood: 'endTagIgnore',
	thead: 'endTagIgnore',
	tr: 'endTagIgnore',
	'-default': 'endTagOther'
}

var p = exports.Phase = function InCaptionPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.start_tag_handlers = starts;
	this.end_tag_handlers = ends;
}

p.prototype = new Phase;

p.prototype.ignoreEndTagCaption = function() {
	return !this.inScope('caption', HTML5.TABLE_SCOPING_ELEMENTS);
}

p.prototype.processCharacters = function(data) {
	new inBody(this.parser, this.tree).processCharacters(data);
}

p.prototype.startTagTableElement = function(name, attributes) {
	this.parse_error('unexpected-end-tag', {name: name});
	var ignoreEndTag = this.ignoreEndTagCaption();
	this.parser.phase.processEndTag('caption');
	if(!ignoreEndTag) this.parser.phase.processStartTag(name, attributes)
}

p.prototype.startTagOther = function(name, attributes) {
	new inBody(this.parser, this.tree).processStartTag(name, attributes);
}

p.prototype.endTagCaption = function(name) {
	if(this.ignoreEndTagCaption()) {
		// inner_html case
		assert.ok(this.parser.inner_html);
		this.parse_error('unexpected-end-tag', {name: name});
	} else {
		// AT this code is quite similar to endTagTable in inTable
		this.tree.generateImpliedEndTags();
		if(this.tree.open_elements.last().tagName.toLowerCase() != 'caption') {
			this.parse_error('expected-one-end-tag-but-got-another',
                    		{gotName: "caption", expectedName: this.tree.open_elements.last().tagName.toLowerCase()});
		}

		this.tree.remove_open_elements_until('caption');
	
		this.tree.clearActiveFormattingElements();

		this.parser.newPhase('inTable');
	}
}

p.prototype.endTagTable = function(name) {
	this.parse_error("unexpected-end-table-in-caption");
	var ignoreEndTag = this.ignoreEndTagCaption();
	this.parser.phase.processEndTag('caption')
	if(!ignoreEndTag) this.parser.phase.processEndTag(name);
}

p.prototype.endTagIgnore = function(name) {
	this.parse_error('unexpected-end-tag', {name: name});
}

p.prototype.endTagOther = function(name) {
	new inBody(this.parser, this.tree).processEndTag(name);
}
