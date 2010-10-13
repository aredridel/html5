var Phase = require('./phase').Phase;

var starts = {
	'-default': 'startTagOther'
}

var ends = {
	'-default': 'endTagOther'
}

exports.Phase = function InForeignContentPhase(parser, tree) {
        Phase.call(this, parser, tree);
        this.name = 'in_foreign_content_phase';
	this.start_tag_handlers = starts;
	this.end_tag_handlers = ends;
}

var p = exports.Phase.prototype = new Phase;

p.startTagOther = function(name, attributes, self_closing) {
	if(['mglyph', 'malignmark'].indexOf(name) != -1 
		&& ['mi', 'mo', 'mn', 'ms', 'mtext'].indexOf(this.tree.open_elements.last().tagName) != -1 
		&& this.tree.open_elements.last().namespace == 'math') {
		this.parser.secondary_phase.processStartTag(name, attributes);
		if(this.parser.phase == 'inForeignContent') {
			if(this.tree.open_elements.any(function(e) { return e.namespace })) {
				this.parser.phase = this.parser.secondary_phase;
			}
		}
	} else if(['b', 'big', 'blockquote', 'body', 'br', 'center', 'code', 'dd', 'div', 'dl', 'dt', 'em', 'embed', 'font', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'i', 'img', 'li', 'listing', 'menu', 'meta', 'nobr', 'ol', 'p', 'pre', 'ruby', 's', 'small', 'span', 'strong', 'strike', 'sub', 'sup', 'table', 'tt', 'u', 'ul', 'var'].indexOf(name) != -1) {
		this.parse_error('html-in-foreign-content', {name: name});
		while(this.tree.open_elements.last().namespace) {
			this.tree.open_elements.pop();
		}
		this.parser.phase = this.parser.secondary_phase;
		this.parser.phase.processStartTag(name, attributes);
	} else {
		if(this.tree.open_elements.last().namespace == 'math') {
			attributes = this.adjust_mathml_attributes(attributes)
		}
		attributes = this.adjust_foreign_attributes(attributes)
		this.tree.insert_foreign_element(name, attributes, this.tree.open_elements.last().namespace);
		if(self_closing) this.tree.open_elements.pop()
	}
}

p.endTagOther = function(name) {
	this.parser.secondary_phase.processEndTag(name)
	if(this.parser.phase == 'inForeignContent') {
		if(this.tree.open_elements.any(function(e) { return e.namespace })) {
			this.parser.phase = this.parser.secondary_phase;
		}
	}
}

p.processCharacters = function(characters) {
	this.tree.insert_text(characters);
}
