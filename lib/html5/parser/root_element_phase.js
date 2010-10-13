var Phase = require('./phase').Phase

exports.Phase = function rootElementPhase(parser, tree) {
	Phase.call(this, parser, tree)
}

var p = exports.Phase.prototype = new Phase;

p.processEOF = function() {
	this.insert_html_element()
	this.parser.phase.processEOF()
}

p.processComment = function(data) {
	this.tree.insert_comment(data, this.tree.document)
}

p.processSpaceCharacters = function(data) {
}

p.processCharacters = function(data) {
	this.insert_html_element()
	this.parser.phase.processCharacters(data)
}

p.processStartTag = function(name, attributes) {
	if(name == 'html') this.parser.first_start_tag = true
	this.insert_html_element()
	this.parser.phase.processStartTag(name, attributes)
}

p.processEndTag = function(name) {
	this.insert_html_element()
	this.parser.phase.processEndTag(name)
}

p.insert_html_element = function() {
	var element = this.tree.createElement('html', {})
	this.tree.open_elements.push(element)
	this.tree.document.appendChild(element)
	this.parser.newPhase('beforeHead')
}
