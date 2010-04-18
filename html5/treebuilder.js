var HTML5 = this.HTML5 = require('html5/constants').HTML5;
var sys = require('sys');
var assert = require('assert');

this.HTML5.TreeBuilder = b = function TreeBuilder() {
	this.open_elements = [];
	this.document = new FakeDomDocument();
	this.activeFormattingElements = [];
	this.Marker = null;
}

b.prototype.reset = function() {

}

b.prototype.createElement = function (name, attributes) {
	return new FakeDomElement(name, attributes);
}

b.prototype.insert_element = function(name, attributes, namespace) {
	var element = new FakeDomElement(name, namespace);
	element.attributes = attributes;
	this.open_elements[this.open_elements.length - 1].appendChild(element);
	this.open_elements.push(element);
require('sys').debug("inserting " +  name);
require('sys').debug(arguments.callee.caller);
	return element;
}

b.prototype.insert_text = function(data, parent) {
	if(!parent) parent = this.open_elements[this.open_elements.length - 1];
sys.debug("inserting '" + data + "' into " + parent.name);
	if(!this.insert_from_table || (this.insert_from_table && TABLE_INSERT_MODE_ELEMENTS.indexOf(this.open_elements[this.open_elements.length - 1].name) == -1)) {
		parent.insertText(data);
	} else {
		// We should be in the inTable phase. This means we want to do special
		// magic element rearranging.
		// FIXME
		throw("So very not implemented");
	}
}

b.prototype.appendChild = function(node) {
}

b.prototype.elementInScope = function(name, tableVariant) {
	if(this.open_elements[this.open_elements.length - 1] && this.open_elements[this.open_elements.length - 1].name == name) return true;
	if(this.open_elements.length == 0) return false;
	for(var i = this.open_elements.length - 1; i >= 0; i--) {
		if(this.open_elements[i].name == name) return true
		else if(this.open_elements[i].name == 'table') return false
		else if(!tableVariant && HTML5.SCOPING_ELEMENTS.indexOf(this.open_elements[i].name) != -1) return false
		else if(this.open_elements[i] == 'html') return false;
	}
	assert.ok(false) // should never get here
}

b.prototype.generateImpliedEndTags = function (exclude) {
	var name = this.open_elements[this.open_elements.length - 1].name;
	if(['dd', 'dt', 'li', 'p', 'td', 'th', 'tr'].indexOf(name) != -1 && name != exclude) {
		var p  = this.open_elements.pop();
		this.generateImpliedEndTags(exclude);
	}
}

b.prototype.reconstructActiveFormattingElements = function() {
	// Within this algorithm the order of steps decribed in the specification
	// is not quite the same as the order of steps in the code. It should still
	// do the same though.

	sys.debug("reconstructActiveFormattingElements with "+sys.inspect(this.activeFormattingElements));

	// Step 1: stop if there's nothing to do
	if(this.activeFormattingElements.length == 0) return;

	// Step 2 and 3: start with the last element
	i = this.activeFormattingElements.length - 1;
	var entry = this.activeFormattingElements[i];
	if(entry == Marker || this.open_elements.indexOf(entry) != -1) return;

	while(!(entry != Marker || this.open_elements.indexOf(entry) != -1)) {
		i -= 1;
		entry = this.activeFormattingElements[i];
		// if ! entry break; ?
	}

	while(true) {
		i += 1;
		var clone = this.activeFormattingElements[i].cloneNode();

		var element = insert_element(clone.name, clone.attributes);

		this.activeFormattingElements[i] = element;

		if(element == this.activeFormattingElements[this.activeFormattingElements.length - 1]) break;
	}
}

function FakeDomDocument() {
	this.root = null;
}

FakeDomDocument.prototype = {
	appendChild: function(element)  {
		if(this.child) throw('Already have a root element');
		this.root = element;
	}
}

function FakeDomElement(name) {
	this.name = name;
	this.children = [];
}

FakeDomElement.prototype = {
	appendChild: function(node) {	
		if(node instanceof FakeTextNode && this.children.length > 0
			&& this.children[this.children.length - 1] instanceof FakeTextNode) {
			this.children[this.children.length - 1].value += node.value;
		} else {
			this.children.push(node);
		}
		node.parent = this;
	},
	insertText: function(data, before) {
		if(before) {
			this.insertBefore(new FakeTextNode(data), before);
		} else {
			this.appendChild(new FakeTextNode(data));
		}
	}
}

function FakeTextNode(data) {
	this.value = data;
}
