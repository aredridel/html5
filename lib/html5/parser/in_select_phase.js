var Phase = require('./phase').Phase;
var HTML5 = require('../../html5');

var starts = {
	html: 'startTagHtml',
	option: 'startTagOption',
	optgroup: 'startTagOptgroup',
	select: 'startTagSelect',
	'-default': 'startTagOther',
}

var ends = {
	option: 'endTagOption',
	optgroup: 'endTagOptgroup',
	select: 'endTagSelect',
	caption: 'endTagTableElements',
	table: 'endTagTableElements',
	tbody: 'endTagTableElements',
	tfoot: 'endTagTableElements',
	thead: 'endTagTableElements',
	tr: 'endTagTableElements',
	td: 'endTagTableElements',
	th: 'endTagTableElements',
	'-default': 'endTagOther',
}
	
exports.Phase = function InSelectPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.start_tag_handlers = starts;
	this.end_tag_handlers = ends;
}

var p = exports.Phase.prototype = new Phase;

p.processCharacters = function(data) {
	this.tree.insert_text(data);
}

p.startTagOption = function(name, attributes) {
	// we need to imply </option> if <option> is the current node
	if(this.tree.open_elements.last().tagName.toLowerCase() == 'option') this.tree.pop_element();
	this.tree.insert_element(name, attributes);
}

p.startTagOptgroup = function(name, attributes) {
	if(this.tree.open_elements.last().tagName.toLowerCase() == 'option') this.tree.pop_element();
	if(this.tree.open_elements.last().tagName.toLowerCase() == 'optgroup') this.tree.pop_element();
	this.tree.insert_element(name, attributes);
}
	
p.endTagOption = function(name) {
	if(this.tree.open_elements.last().tagName.toLowerCase() == 'option') {
		 this.tree.pop_element();
	} else {
		this.parse_error('unexpected-end-tag-in-select', {name: 'option'});
	}
}

p.endTagOptgroup = function(name) {
	// </optgroup> implicitly closes <option>
	if(this.tree.open_elements.last().tagName.toLowerCase() == 'option' && this.tree.open_elements[this.tree.open_elements.length - 2].tagName.toLowerCase() == 'optgroup') {
		this.tree.pop_element();
	}

	// it also closes </optgroup>
	if(this.tree.open_elements.last().tagName.toLowerCase() == 'optgroup') {
		this.tree.pop_element();
	} else {
		// But nothing else
		this.parse_error('unexpected-end-tag-in-select', {name: 'optgroup'});
	}
}

p.startTagSelect = function(name) {
	this.parse_error("unexpected-select-in-select");
	this.endTagSelect('select');
}

p.endTagSelect = function(name) {
	if(this.inScope('select', HTML5.TABLE_SCOPING_ELEMENTS)) {
		this.tree.remove_open_elements_until('select');
		this.parser.reset_insertion_mode(this.tree.open_elements.last());
	} else {
		// inner_html case
		this.parse_error();
	}
}

p.endTagTableElements = function(name) {
	this.parse_error('unexpected-end-tag-in-select', {name: name});
	
	if(this.inScope(name, HTML5.TABLE_SCOPING_ELEMENTS)) {
		this.endTagSelect('select');
		this.parser.phase.processEndTag(name);
	}
}

p.startTagOther = function(name, attributes) {
	this.parse_error("unexpected-start-tag-in-select", {name: name})
}

p.endTagOther = function(name) {
	this.parse_error('unexpected-end-tag-in-select', {name: name});
}

