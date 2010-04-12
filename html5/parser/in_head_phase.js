var Phase = require('html5/parser/phase').Phase;
exports.Phase = p = function InHeadPhase(parser, tree) {
	Phase.call(this, parser, tree);
}

p.prototype = new Phase;

// FIXME handle_start html head title type script noscript
// FIXME handle_start base link meta
// FIXME handle_end head
// FIXME handle_end html body br => ImplyAfterHead
// FIXME handle_end title style script noscript

p.prototype.process_eof = function() {
	var name = this.tree.open_elements[this.tree.open_elements.length - 1].name;
	if(['title', 'style', 'script'].indexOf(name) != -1) {
		this.parse_error("expected-named-closing-tag-but-got-eof", {name: name});
		this.tree.open_elements.pop();
	}

	this.anything_else();

	this.parser.phase.process_eof();
}

p.prototype.processCharacters = function(data) {
	var name = this.tree.open_elements[this.tree.open_elements.length - 1].name;
	if(['title', 'style', 'script', 'noscript'].indexOf(name) != -1) {
		this.tree.insertText(data);
	} else {
		this.anything_else();
		this.parser.phase.processCharacters(data);
	}
}

p.prototype.startTagHead = function(name, attributes) {
	this.parse_error('two-heads-are-not-better-than-one');
}

p.prototype.startTagTitle = function(name, attributes) {
	if(this.tree.head_pointer && this.parser.phase == new PHASES.inHead(this.parser, this.tree)) {
		var element = this.tree.createElement(name, attributes);
		this.appendToHead(element);
		this.tree.open_elements.push(element);
	} else {
		this.tree.insert_element(name, attributes);
	}
	this.parser.tokenizer.content_model = Models.RCDATA;
}

p.prototype.startTagStyle = function(name, attributes) {
	if(this.tree.head_pointer && this.parser.phase == new PHASES.inHead(this.parser, this.tree)) {
		var element = this.tree.createElement(name, attributes);
		this.appendToHead(element);
		this.tree.open_elements.push(name, attributes);
	} else {
		this.tree.insert_element(name, attributes);
	}
	this.parser.tokenizer.content_model = Models.CDATA;
}

p.prototype.startTagNoscript = function(name, attributes) {
	// XXX Need to decide whether to implement the scripting disabled case
	var element = this.tree.createElement(name, attributes);
	if(this.tree.head_pointer && this.parser.phase == new PHASES.inHead(this.parser, this.tree)) {
		this.appendToHead(element);
	} else {
		this.tree.open_elements[this.tree.open_elements.length - 1].appendChild(element);
	}
	this.tree.open_elements.push(element);
	this.parser.tokenizer.content_model = Models.CDATA;
}

p.prototype.startTagScript = function(name, attributes) {
	// XXX Innre HTML case may be wrong
	var element = this.tree.createElement(name, attribute);
	element.flags.push('parser-inserted');
	if(this.tree.head_pointer && this.parser.phase == new PHASES.inHead(this.parser, this.tree)) {
		this.appendToHead(element);
	} else {
		this.tree.open_elements[this.tree.open_elements.length - 1].appendChild(element);
	}
	this.tree.open_elements.push(element);
	this.parser.tokenizer.content_model = Models.CDATA;
}

p.prototype.startTagBaseLinkMeta = function(name, attributes) {
	if(this.tree.head_pointer && this.parser.phase == new PHASES.inHead(this.parser, this.tree)) {
		this.createElement(name, attributes);
		this.appendToHead(element);
	} else {
		this.insert_element(name, attributes);
		this.tree.open_elements.pop();
	}
}

p.prototype.startTagOther = function(name, attributes) {
	this.anything_else();
	this.parser.phase.processStartTag(name, attributes);
}

p.prototype.endTagHead = function(name) {
	if(this.tree.open_elements[this.tree.open_elements.length - 1].name == 'head') {
		this.tree.open_elements.pop();
	} else {
		this.parse_error('unexpected-end-tag', {name: 'head'});
	}
	this.parser.phase = new PHASES.afterHead(this.parser, this.tree);
}

p.prototype.endTagImplyAfterHead = function(name) {
	this.anything_else();
	this.parser.phase.processEndTag(name);
}

p.prototype.endTagStyleScriptNoscript = function(name) {
	if(this.tree.open_elements[this.tree.open_elements.length - 1].name == name) {
		this.tree.open_elements.pop();
	} else {
		this.parse_error('unexpected-end-tag', {name: name});
	}
}

p.prototype.endTagOther = function(name) {
	this.anything_else();
}

p.prototype.anything_else = function() {
	if(this.tree.open_elements[this.tree.open_elements.length - 1].name == 'head') {
		endTagHead('head');
	} else {
		this.parser.phase = new PHASES.afterHead(this.parser, this.tree);
	}
}

// protected

p.prototype.appendToHead = function(element) {
	if(!tree.head_pointer) {
		// FIXME assert(this.parser.inner_html)
		this.tree.open_elements[this.tree.open_elements.length - 1].appendChild(element);
	} else {
		this.tree.head_pointer.appendChild(element);
	}
}
