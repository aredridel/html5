var Phase = require('./phase').Phase;
var HTML5 = require('../../html5');

var p = exports.Phase = function BeforeHtmlPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.name = 'before_html_phase'
}

p.prototype = new Phase;

p.prototype.processEOF = function() {
	this.insert_html_element();
	this.parser.phase.processEOF();
}

p.prototype.processComment = function(data) {
	this.tree.insert_comment(data, this.tree.document);
}

p.prototype.processSpaceCharacters = function(data) {
}

p.prototype.processCharacters = function(data) {
	this.insert_html_element();
	this.parser.phase.processCharacters(data);
}

p.prototype.processStartTag = function(name, attributes, self_closing) {
	if(name == 'html') this.parser.first_start_tag = true;
	this.insert_html_element();
	this.parser.phase.processStartTag(name, attributes);
}

p.prototype.processEndTag = function(name) {
	this.insert_html_element();
	this.parser.phase.processEndTag(name);
}

p.prototype.insert_html_element = function() {
	var de
	if(de = this.tree.document.documentElement) {
		if(de.tagName != 'HTML')
			HTML5.debug('parser.before_html_phase', 'Non-HTML root element!')
		this.tree.open_elements.push(de)
		while(de.childNodes.length >= 1) de.removeChild(de.firstChild)
	} else {
		var element = this.tree.createElement('html', []);
		this.tree.open_elements.push(element);
		this.tree.document.appendChild(element);
	}
	this.parser.newPhase('beforeHead');
}
