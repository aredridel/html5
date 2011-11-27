var HTML5 = require('../../html5')
var Phase = require('./phase').Phase;
var inSelect = require('./in_select_phase').Phase;

var start_tag_handlers = {
	caption: 'startTagTable',
	table: 'startTagTable',
	tbody: 'startTagTable',
	tfoot: 'startTagTable',
	thead: 'startTagTable',
	tr: 'startTagTable',
	td: 'startTagTable',
	th: 'startTagTable',
	'-default': 'startTagOther'
}

var end_tag_handlers = {
	caption: 'endTagTable',
	table: 'endTagTable',
	tbody: 'endTagTable',
	tfoot: 'endTagTable',
	thead: 'endTagTable',
	tr: 'endTagTable',
	td: 'endTagTable',
	th: 'endTagTable',
	'-default': 'endTagOther'
}

exports.Phase = function InSelectInTablePhase(parser, tree) {
        Phase.call(this, parser, tree);
        this.start_tag_handlers = start_tag_handlers;
        this.end_tag_handlers = end_tag_handlers;
        this.name = 'in_select_in_table';
}

var p = exports.Phase.prototype = new Phase;

p.processCharacters = function(data) {
	new inSelect(this.parser, this.tree).processCharacters(data)
}

p.startTagTable = function(name, attributes) {
	this.parse_error("unexpected-table-element-start-tag-in-select-in-table", {name: name})
    	this.endTagOther("select")
	this.parser.phase.processStartTag(name, attributes)
}

p.startTagOther = function(name, attributes) {
	new inSelect(this.parser, this.tree).processStartTag(name, attributes)
}

p.endTagTable = function(name) {
	this.parse_error("unexpected-table-element-end-tag-in-select-in-table", {name: name})
	if(this.inScope(name, HTML5.TABLE_SCOPING_ELEMENTS)) {
		this.endTagOther("select")
		this.parser.phase.processEndTag(name)
	}
}

p.endTagOther = function(name) {
	new inSelect(this.parser, this.tree).processEndTag(name)
}
