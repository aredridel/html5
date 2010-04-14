var sys = require('sys');
exports.TreeBuilder = b = function TreeBuilder() {
	this.open_elements = [];
	this.document = new FakeDomDocument();
	this.childNodes = [];
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

b.prototype.insert_text = function(data, before) {
	if(before) {
		this.insert_before(new FakeTextNode(data), before);
	} else {
		this.appendChild(new FakeTextNode(data));
	}
}

b.prototype.appendChild = function(node) {
	if(node instanceof FakeTextNode && this.childNodes.length > 0
		&& this.childNodes[this.childNodes.length - 1] instanceof FakeTextNode) {
		this.childNodes[this.childNodes.length - 1].value += node.value;
	} else {
		this.childNodes.push(node);
	}
	node.parent = this;
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

function FakeTextNode(data) {
	this.value = data;
}
