var sys = require('sys');
exports.TreeBuilder = b = function TreeBuilder() {
	this.open_elements = [];
	this.document = new FakeDomDocument();
}

b.prototype.reset = function() {

}

b.prototype.createElement = function (name, attributes) {
	sys.puts("createElement " + name + " with attributes " + sys.inspect(attributes));
	return new FakeDomElement(name, attributes);
}

b.prototype.insert_element = function(name, attributes, namespace) {
	var element = new FakeDomElement(name, namespace);
	element.attributes = attributes;
	this.open_elements[this.open_elements.length - 1].appendChild(element);
	this.open_elements.push(element);
	return element;
}

function FakeDomDocument() {
	this.child = null;
}

FakeDomDocument.prototype = {
	appendChild: function(element)  {
		if(this.child) throw('Already have a root element');
		this.child = element;
	}
}

function FakeDomElement(name) {
	this.tagName = name;
	this.children = [];
}

FakeDomElement.prototype = {
	appendChild: function(element) {	
		this.children.push(element);
	}
}
