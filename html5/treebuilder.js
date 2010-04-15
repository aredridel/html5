exports.TreeBuilder = b = function TreeBuilder() {
	this.open_elements = [];
	this.document = new FakeDomDocument();
	this.childNodes = [];
	this.activeFormattingElements = [];
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

b.prototype.elementInScope = function(name, tableVariant) {
	if(this.open_elements[this.open_elements.length - 1] && this.open_elements[this.open_elements.length - 1].name == name) return true;
	if(this.open_elements.length == 0) return false;
	for(var i = this.open_elements.length - 1; i >= 0; i--) {
		if(this.open_elements[i].name == name) return true
		else if(this.open_elements[i].name == 'table') return false
		else if(!tableVariant && SCOPING_ELEMENTS.indexOf(this.open_elements[i].name) != -1) return false
		else if(this.open_elements[i] == 'html') return false;
	}
	// assert false -- should never get here
}

b.prototype.generateImpliedEndTags = function (exclude) {
	var name = this.open_elements[this.open_elements.length - 1].name;
	if(['dd', 'dt', 'li', 'p', 'td', 'th', 'tr'].indexOf(name) != -1 && name != exclude) {
		this.open_elements.pop();
		this.generateImpliedEndTags(exclude);
	}
}

b.prototype.reconstructActiveFormattingElements = function() {
	// Within this algorithm the order of steps decribed in the specification
	// is not quite the same as the order of steps in the code. It should still
	// do the same though.

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
	this.child = null;
}

FakeDomDocument.prototype = {
	appendChild: function(element)  {
		if(this.child) throw('Already have a root element');
		this.child = element;
	}
}

function FakeDomElement(name) {
	this.name = name;
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
