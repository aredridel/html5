require('core-upgrade');
var HTML5 = require('html5');
var sys = require('sys');
var assert = require('assert');
var DOM = require('dom'); // Use env-js dom

HTML5.TreeBuilder = b = function TreeBuilder() {
	this.open_elements = [];
	this.document = new DOM.Document(DOM.DOMImplementation);
	this.activeFormattingElements = [];
	this.Marker = {purpose: 'this is a marker token'};
}

b.prototype.reset = function() {

}

b.prototype.createElement = function (name, attributes) {
	var el = this.document.createElement(name)
	el.attributes = attributes;
	return el;
}

b.prototype.insert_element = function(name, attributes, namespace) {
	var element = this.createElement(name, namespace);
	element.attributes = attributes;
	this.open_elements.last().appendChild(element);
	this.open_elements.push(element);
	HTML5.debug('treebuilder.insert_element', "open elements are " + HTML5.dumpTagStack(this.open_elements));
	return element;
}

b.prototype.insert_comment = function(data, parent) {
	var c = this.document.createComment(data);
	HTML5.debug('treebuilder', 'open elements at insert_comment are: ' + require('sys').inspect(this.open_elements.map(function(e) { return e.nodeName })));
	if(!parent) parent = this.open_elements.last();
	parent.appendChild(c);
}

b.prototype.insert_doctype = function (name, publicId, systemId) {
	// var dt = this.document.implementation.createDocumentType(name, publicId, systemId);
	var doctype = new DOM.DocumentType();
        doctype.nodeName = name?name:null;
        doctype.publicId = publicId?publicId:null;
        doctype.systemId = systemId?systemId:null;
	this.document.appendChild(doctype);
}
	

b.prototype.insert_text = function(data, parent) {
	if(!parent) parent = this.open_elements.last();
	if(!this.insert_from_table || HTML5.TABLE_INSERT_MODE_ELEMENTS.indexOf(this.open_elements.last().tagName) == -1) {
		if(parent.lastChild && parent.lastChild.nodeType == DOM.Node.TEXT_NODE) {
			parent.lastChild.appendData(data);
		} else {
			var tn = this.document.createTextNode(data);
			parent.appendChild(tn);
		}
	} else {
		// We should be in the inTable phase. This means we want to do special
		// magic element rearranging.
		// FIXME
		throw(new Error("So very not implemented"));
	}
}

b.prototype.elementInScope = function(name, tableVariant) {
	if(this.open_elements.length == 0) return false;
	if(this.open_elements.last().tagName == name) return true;
	for(var i = this.open_elements.length - 1; i >= 0; i--) {
		if(this.open_elements[i].tagName == name) return true
		else if(this.open_elements[i].tagName == 'table') return false
		else if(!tableVariant && HTML5.SCOPING_ELEMENTS.indexOf(this.open_elements[i].tagName) != -1) return false
		else if(this.open_elements[i] == 'html') return false;
	}
	return false; 
}

b.prototype.generateImpliedEndTags = function (exclude) {
	//HTML5.debug('implied end tags with ' + sys.inspect(this.open_elements.map(function(el) { return el.tagName })));
	var name = this.open_elements.last().tagName;
	if(['dd', 'dt', 'li', 'p', 'td', 'th', 'tr'].indexOf(name) != -1 && name != exclude) {
		var p  = this.open_elements.pop();
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
	var i = this.activeFormattingElements.length - 1;
	var entry = this.activeFormattingElements[i];
	if(entry == this.Marker || this.open_elements.indexOf(entry) != -1) return;

	while(!(entry == this.Marker || this.open_elements.indexOf(entry) != -1)) {
		i -= 1;
		entry = this.activeFormattingElements[i];
		if(!entry) break;
	}

	while(true) {
		i += 1;
		var clone = this.activeFormattingElements[i].cloneNode();

		var element = this.insert_element(clone.tagName, clone.attributes);

		this.activeFormattingElements[i] = element;

		if(element == this.activeFormattingElements.last()) break;
	}

	HTML5.debug('treebuilder.reconstructActiveFormattingElements', 'open tags are ' + HTML5.dumpTagStack(this.open_elements));
}

b.prototype.elementInActiveFormattingElements = function(name) {
	var els = this.activeFormattingElements.reverse();
	for(i in els) {
		if(els[i] == this.Marker) break;
		if(els[i].tagName == name) return els[i];
	}
	return false;
}
