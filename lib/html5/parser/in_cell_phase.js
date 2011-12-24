var Phase = require('./phase').Phase;
var inBody = require('./in_body_phase').Phase;
var HTML5 = require('../../html5');

var starts = {
	html: 'startTagHtml',
	caption: 'startTagTableOther',
	col: 'startTagTableOther',
	colgroup: 'startTagTableOther',
	tbody: 'startTagTableOther',
	td: 'startTagTableOther',
	tfoot: 'startTagTableOther',
	th: 'startTagTableOther',
	thead: 'startTagTableOther',
	tr: 'startTagTableOther',
	'-default': 'startTagOther',
}

var ends = {
	td: 'endTagTableCell',
	th: 'endTagTableCell',
	body: 'endTagIgnore',
	caption: 'endTagIgnore',
	col: 'endTagIgnore',
	colgroup: 'endTagIgnore',
	html: 'endTagIgnore',
	table: 'endTagImply',
	tbody: 'endTagImply',
	tfoot: 'endTagImply',
	thead: 'endTagImply',
	tr: 'endTagImply',
	'-default': 'endTagOther',
}

exports.Phase = function InCellPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.start_tag_handlers = starts;
	this.end_tag_handlers = ends;
}

exports.Phase.prototype = new Phase;

var p = exports.Phase.prototype;

p.processCharacters = function(data) {
	new inBody(this.parser, this.tree).processCharacters(data);
}

p.startTagTableOther = function(name, attributes) {
	if(this.inScope('td', HTML5.TABLE_SCOPING_ELEMENTS) || this.inScope('th', HTML5.TABLE_SCOPING_ELEMENTS)) {
		this.closeCell();
		this.parser.phase.processStartTag(name, attributes);
	} else {
		// inner_html case
		this.parse_error();
	}
}

p.startTagOther = function(name, attributes) {
	new inBody(this.parser, this.tree).processStartTag(name, attributes);
}

p.endTagTableCell = function(name) {
	if(this.inScope(name, HTML5.TABLE_SCOPING_ELEMENTS)) {
		this.tree.generateImpliedEndTags(name);
		if(this.tree.open_elements.last().tagName.toLowerCase() != name.toLowerCase()) {
			this.parse_error('unexpected-cell-end-tag', {name: name});
			this.tree.remove_open_elements_until(name);
		} else {
			this.tree.pop_element();
		}
		this.tree.clearActiveFormattingElements();
		this.parser.newPhase('inRow');
	} else {
		this.parse_error('unexpected-end-tag', {name: name});
	}
}

p.endTagIgnore = function(name) {
	this.parse_error('unexpected-end-tag', {name: name});
}

p.endTagImply = function(name) {
	if(this.inScope(name, HTML5.TABLE_SCOPING_ELEMENTS)) {
		this.closeCell();
		this.parser.phase.processEndTag(name);
	} else {
		// sometimes inner_html case
		this.parse_error
	}
}

p.endTagOther = function(name) {
	new inBody(this.parser, this.tree).processEndTag(name);
}

p.closeCell = function() {
	if(this.inScope('td', HTML5.TABLE_SCOPING_ELEMENTS)) {
		this.endTagTableCell('td');
	} else if(this.inScope('th', HTML5.TABLE_SCOPING_ELEMENTS)) {
		this.endTagTableCell('th');
	}
}
