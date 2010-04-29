var Phase = require('lib/html5/parser/phase').Phase;
var inBody = require('lib/html5/parser/in_body_phase').Phase;

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
}

exports.Phase = p = function InTablePhase(tree, parser) {

};

p.prototype.processCharacters =  function(data) {
	this.parse_error("unexpected-char-implies-table-voodoo");
	this.tree.insert_from_table = true;
	new inBody(this.tree, this.parser).processCharacters(data);
	this.tree.insert_from_table = false;
}

p.prototype.startTagCaption = function(name, attributes) {
	this.clearStackToTableContext();
	this.tree.activeFormattingElements.push(this.tree.Marker);
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

p.prototype.startTagOther= function(name, attributes) {
	this.parse_error("unexpected-start-tag-implies-table-voodoo", {name: name});
	this.tree.insert_from_table = true;
	new inBody(tree, parser).processStartTag(name, attributes);
	this.tree.insert_from_table = false;
}

p.prototype.endTagTable = function(name) {
	if(this.inScope(name, true)) {
		this.tree.generateImpliedEndTags();
		if(tree.open_elements[tree.open_elements.length - 1].nodeName != name) {
			this.parse_error("end-tag-too-early-named", {gotName: 'table', expectedName: this.tree.open_elements[this.tree.open_elements.length - 1].tagName});
		}

		this.remove_open_elements_until('table');
		this.parser.reset_insertion_mode();
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
	new inBody(tree,parser).processEndTag(name)
	this.tree.insert_from_table = false
}

p.prototype.clearStackToTableContext = function() {
	var name;
	while(name = this.tree.open_elements[this.tree.open_elements.length - 1].tagName, (name != 'table' || name != 'html')) {
		this.parse_error("unexpected-implied-end-tag-in-table",
                 {name:  this.tree.open_elements[this.tree.open_elements.length - 1].tagName})
		this.ree.open_elements.pop()
	}
	// When the current node is <html> it's an inner_html case
}
