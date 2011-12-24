var Phase = require('./phase').Phase;
var inBody = require('./in_body_phase').Phase;
var HTML5 = require('../../html5')

var start_tag_handlers = {
	html: 'startTagHtml',
	caption: 'startTagCaption',
	colgroup: 'startTagColgroup',
	col: 'startTagCol',
	table: 'startTagTable',
	tbody: 'startTagRowGroup',
	tfoot: 'startTagRowGroup',
	thead: 'startTagRowGroup',
	td: 'startTagImplyTbody',
	th: 'startTagImplyTbody',
	tr: 'startTagImplyTbody',
	'-default': 'startTagOther',
}

var end_tag_handlers = {
	table: 'endTagTable',
	body: 'endTagIgnore',
	caption: 'endTagIgnore',
	col: 'endTagIgnore',
	colgroup: 'endTagIgnore',
	html: 'endTagIgnore',
	tbody: 'endTagIgnore',
	td: 'endTagIgnore',
	tfoot: 'endTagIgnore',
	th: 'endTagIgnore',
	thead: 'endTagIgnore',
	tr: 'endTagIgnore',
	'-default': 'endTagOther',
}

var p = exports.Phase = function InTablePhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.start_tag_handlers = start_tag_handlers;
	this.end_tag_handlers = end_tag_handlers;
};

p.prototype = new Phase;

p.prototype.processCharacters =  function(data) {
	this.parse_error("unexpected-char-implies-table-voodoo");
	this.tree.insert_from_table = true;
	new inBody(this.parser, this.tree).processCharacters(data);
	this.tree.insert_from_table = false;
}

p.prototype.startTagCaption = function(name, attributes) {
	this.clearStackToTableContext();
	this.tree.activeFormattingElements.push(HTML5.Marker);
	this.tree.insert_element(name, attributes);
	this.parser.newPhase('inCaption');
}

p.prototype.startTagColgroup = function(name, attributes) {
	this.clearStackToTableContext();
	this.tree.insert_element(name, attributes);
	this.parser.newPhase('inColumnGroup');
}

p.prototype.startTagCol = function(name, attributes) {
	this.startTagColgroup('colgroup', {});
	this.parser.phase.processStartTag(name, attributes);
}

p.prototype.startTagRowGroup = function(name, attributes) {
	this.clearStackToTableContext();
	this.tree.insert_element(name, attributes);
	this.parser.newPhase('inTableBody');
}

p.prototype.startTagImplyTbody = function(name, attributes) {
	this.startTagRowGroup('tbody', {});
	this.parser.phase.processStartTag(name, attributes);
}

p.prototype.startTagTable = function(name, attributes) {
	this.parse_error("unexpected-start-tag-implies-end-tag",
            {startName: "table", endName: "table"});
	this.parser.phase.processEndTag('table');
	if(!this.parser.inner_html) this.parser.phase.processStartTag(name, attributes);
}

p.prototype.startTagOther = function(name, attributes) {
	this.parse_error("unexpected-start-tag-implies-table-voodoo", {name: name});
	this.tree.insert_from_table = true;
	new inBody(this.parser, this.tree).processStartTag(name, attributes);
	this.tree.insert_from_table = false;
}

p.prototype.endTagTable = function(name) {
	if(this.inScope(name, HTML5.TABLE_SCOPING_ELEMENTS)) {
		this.tree.generateImpliedEndTags();
		if(this.tree.open_elements.last().tagName.toLowerCase() != name) {
			this.parse_error("end-tag-too-early-named", {gotName: 'table', expectedName: this.tree.open_elements.last().tagName.toLowerCase()});
		}

		this.tree.remove_open_elements_until('table');
		this.parser.reset_insertion_mode(this.tree.open_elements.last());
	} else {
		assert.ok(this.parser.inner_html);
		this.parse_error();
	}
}

p.prototype.endTagIgnore = function(name) {
	this.parse_error("unexpected-end-tag", {name: name});
}

p.prototype.endTagOther = function(name) {
	this.parse_error("unexpected-end-tag-implies-table-voodoo", {name: name})
	// Make all the special element rearranging voodoo kick in
	this.tree.insert_from_table = true
	// Process the end tag in the "in body" mode
	new inBody(this.parser, this.tree).processEndTag(name)
	this.tree.insert_from_table = false
}

p.prototype.clearStackToTableContext = function() {
	var name;
	while(name = this.tree.open_elements.last().tagName.toLowerCase(), (name != 'table' && name != 'html')) {
		this.parse_error("unexpected-implied-end-tag-in-table", {name: name})
		this.tree.pop_element()
	}
	// When the current node is <html> it's an inner_html case
}
