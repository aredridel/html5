var Phase = require('./phase').Phase;
var inTable = require('./in_table_phase').Phase
var HTML5 = require('../../html5');

var starts = {
	html: 'startTagHtml',
	tr: 'startTagTr',
	td: 'startTagTableCell',
	th: 'startTagTableCell',
	caption: 'startTagTableOther',
	col: 'startTagTableOther',
	colgroup: 'startTagTableOther',
	tbody: 'startTagTableOther',
	tfoot: 'startTagTableOther',
	thead: 'startTagTableOther',
	'-default': 'startTagOther',
}

var ends = {
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
	tr: 'endTagIgnore',
	'-default': 'endTagOther',
}

exports.Phase = function InTableBodyPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.start_tag_handlers = starts;
	this.end_tag_handlers = ends;
}

var p = exports.Phase.prototype = new Phase;

p.processCharacters = function(data) {
	new inTable(this.parser, this.tree).processCharacters(data);
}

p.startTagTr = function(name, attributes) {
	this.clearStackToTableBodyContext();
	this.tree.insert_element(name, attributes);
	this.parser.newPhase('inRow');
}

p.startTagTableCell = function(name, attributes) {
	this.parse_error("unexpected-cell-in-table-body", {name: name})
	this.startTagTr('tr', {})
	this.parser.phase.processStartTag(name, attributes);
}

p.startTagTableOther = function(name, attributes) {
	// XXX any ideas on how to share this with endTagTable
	if(this.inScope('tbody', HTML5.TABLE_SCOPING_ELEMENTS) ||  this.inScope('thead', HTML5.TABLE_SCOPING_ELEMENTS) || this.inScope('tfoot', HTML5.TABLE_SCOPING_ELEMENTS)) {
		this.clearStackToTableBodyContext();
		this.endTagTableRowGroup(this.tree.open_elements.last().tagName.toLowerCase());
		this.parser.phase.processStartTag(name, attributes);
	} else {
		// inner_html case
		this.parse_error
	}
}
	
p.startTagOther = function(name, attributes) {
	new inTable(this.parser, this.tree).processStartTag(name, attributes);
}

p.endTagTableRowGroup = function(name) {
	if(this.inScope(name, HTML5.TABLE_SCOPING_ELEMENTS)) {
		this.clearStackToTableBodyContext();
		this.tree.pop_element();
		this.parser.newPhase('inTable');
	} else {
		this.parse_error('unexpected-end-tag-in-table-body', {name: name})
	}
}

p.endTagTable = function(name) {
	if(this.inScope('tbody', HTML5.TABLE_SCOPING_ELEMENTS) || this.inScope('thead', HTML5.TABLE_SCOPING_ELEMENTS) || this.inScope('tfoot', HTML5.TABLE_SCOPING_ELEMENTS)) {
		this.clearStackToTableBodyContext();
		this.endTagTableRowGroup(this.tree.open_elements.last().tagName.toLowerCase())
		this.parser.phase.processEndTag(name)
	} else {
		// inner_html case
		this.parse_error();
	}
}

p.endTagIgnore = function(name) {
	this.parse_error("unexpected-end-tag-in-table-body", {name: name});
}

p.endTagOther = function(name) {
	new inTable(this.parser, this.tree).processEndTag(name);
}

p.clearStackToTableBodyContext = function() {
	var name;
	while(name = this.tree.open_elements.last().tagName.toLowerCase(), name != 'tbody' && name != 'tfoot' && name != 'thead' && name != 'html') {
		this.parse_error("unexpected-implied-end-tag-in-table", {name: name})
		this.tree.pop_element();
	}
}
