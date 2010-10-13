var Phase = require('./phase').Phase;
var HTML5 = require('../../html5')
var inTable = require('./in_table_phase').Phase;
var assert = require('assert');

var starts = {
	html: 'startTagHtml',
	td: 'startTagTableCell',
	th: 'startTagTableCell',
	caption: 'startTagTableOther',
	col: 'startTagTableOther',
	colgroup: 'startTagTableOther',
	tbody: 'startTagTableOther',
	tfoot: 'startTagTableOther',
	thead: 'startTagTableOther',
	tr: 'startTagTableOther',
	'-default': 'startTagOther',
}

var ends = {
	tr: 'endTagTr',
	table: 'endTagTable',
	tbody: 'endTagTableRowGroup',
	tfoot: 'endTagTableRowGroup',
	thead: 'endTagTableRowGroup',
	body: 'endTagIgnore',
	caption: 'endTagIgnore',
	col: 'endTagIgnore',
	colgroup: 'endTagIgnore',
	html: 'endTagIgnore',
	td: 'endTagIgnore',
	th: 'endTagIgnore',
	'-default': 'endTagOther',
}

exports.Phase = function InRowPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.start_tag_handlers = starts;
	this.end_tag_handlers = ends;
}

var p = exports.Phase.prototype = new Phase;

p.processCharacters = function(data) {
	new inTable(this.parser, this.tree).processCharacters(data);
}

p.startTagTableCell = function(name, attributes) {
	this.clearStackToTableRowContext();
	this.tree.insert_element(name, attributes);
	this.parser.newPhase('inCell');
	this.tree.activeFormattingElements.push(HTML5.Marker);
}

p.startTagTableOther = function(name, attributes) {
	var ignoreEndTag = this.ignoreEndTagTr();
	this.endTagTr('tr');
	// XXX how are we sure it's always ignored in the inner_html case?
	if(!ignoreEndTag) this.parser.phase.processStartTag(name, attributes);
}

p.startTagOther = function(name, attributes) {
	new inTable(this.parser, this.tree).processStartTag(name, attributes);
}

p.endTagTr = function(name) {
	if(this.ignoreEndTagTr()) {
		assert.ok(this.parser.inner_html);
		this.parse_error
	} else {
		this.clearStackToTableRowContext();
		this.tree.pop_element();
		this.parser.newPhase('inTableBody');
	}
}

p.endTagTable = function(name) {
	var ignoreEndTag = this.ignoreEndTagTr();
	this.endTagTr('tr');
	// Reprocess the current tag if the tr end tag was not ignored
	// XXX how are we sure it's always ignored in the inner_html case?
	if(!ignoreEndTag) this.parser.phase.processEndTag(name) 
}

p.endTagTableRowGroup = function(name) {
	if(this.inScope(name, true)) {
		this.endTagTr('tr');
		this.parser.phase.processEndTag(name);
	} else {
		// inner_html case
		this.parse_error();
	}
}

p.endTagIgnore = function(name) {
	this.parse_error("unexpected-end-tag-in-table-row", {name: name})
}

p.endTagOther = function(name) {
	new inTable(this.parser, this.tree).processEndTag(name);
}

p.clearStackToTableRowContext = function() {
	var name;
	while(name = this.tree.open_elements.last().tagName.toLowerCase(), (name != 'tr' && name != 'html')) {
		this.parse_error("unexpected-implied-end-tag-in-table-row", {name: name})
		this.tree.pop_element();
	}
}

p.ignoreEndTagTr = function() {
	return !this.inScope('tr', true);
}
