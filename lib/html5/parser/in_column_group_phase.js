var Phase = require('./phase').Phase
var HTML5 = require('../../html5')
var assert = require('assert')

var start = {
	html: 'startTagHtml',
	col: 'startTagCol',
	'-default': 'startTagOther',
}

var end = {
	colgroup: 'endTagColgroup',
	col: 'endTagCol',
	'-default': 'endTagOther',
}

exports.Phase = function InColgroupPhase(parser, tree) {
	Phase.call(this, parser, tree)
	this.start_tag_handlers = start
	this.end_tag_handlers = end
}

var p = exports.Phase.prototype = new Phase;

p.ignoreEndTagColgroup = function() {
	return this.tree.open_elements.last().tagName.toLowerCase() == 'html'
}

p.processCharacters = function(data) {
	var ignoreEndTag = this.ignoreEndTagColgroup()
	this.endTagColgroup('colgroup')
	if(!ignoreEndTag) this.parser.phase.processCharacters(data)
}

p.startTagCol = function(name, attributes) {
	this.tree.insert_element(name, attributes)
	this.tree.pop_element()
}

p.startTagOther = function(name, attributes) {
	var ignoreEndTag = this.ignoreEndTagColgroup()
	this.endTagColgroup('colgroup')
	if(!ignoreEndTag) this.parser.phase.processStartTag(name, attributes)
}

p.endTagColgroup = function(name) {
	if(this.ignoreEndTagColgroup()) {
		// inner_html case
		assert.ok(this.parser.inner_html)
		this.parse_error()
	} else {
		this.tree.pop_element()
		this.parser.newPhase('inTable')
	}
}

p.endTagCol = function(name) {
	this.parse_error("no-end-tag", {name: 'col'})
}

p.endTagOther = function(name) {
	var ignoreEndTag = this.ignoreEndTagColgroup()
	this.endTagColgroup('colgroup')
	if(!ignoreEndTag) this.parser.phase.processEndTag(name) 
}
