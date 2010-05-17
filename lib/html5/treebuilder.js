require('core-upgrade');
var HTML5 = require('html5');
var sys = require('sys');
var assert = require('assert');
var DOM = require('dom'); // Use env-js dom

HTML5.TreeBuilder = b = function TreeBuilder() {
	this.open_elements = [];
	this.document = new DOM.Document(DOM.DOMImplementation);
	this.activeFormattingElements = [];
}

b.prototype.reset = function() {

}

b.prototype.createElement = function (name, attributes, namespace) {
	var el = this.document.createElement(name)
	if(attributes) for(var i = 0; i < attributes.length; i++) {
		el.setAttribute(attributes[i].nodeName, attributes[i].nodeValue);
	}
	return el;
}

b.prototype.insert_element = function(name, attributes, namespace) {
	HTML5.debug('treebuilder.insert_element', name)
	if(this.insert_from_table) {
		return this.insert_element_from_table(name, attributes, namespace)
	} else {
		return this.insert_element_normal(name, attributes, namespace)
	}
}

b.prototype.insert_element_normal = function(name, attributes, namespace) {
	HTML5.debug('treebuilder.insert_element_normal', name)
	var element = this.createElement(name, attributes, namespace);
	this.open_elements.last().appendChild(element);
	this.open_elements.push(element);
	return element;
}

b.prototype.insert_element_from_table = function(name, attributes, namespace) {
	HTML5.debug('treebuilder.insert_element_from_table', name)
	var element = this.createElement(name, attributes, namespace)
	if(HTML5.TABLE_INSERT_MODE_ELEMENTS.indexOf(this.open_elements.last().tagName) != -1) {
		// We should be in the InTable mode. This means we want to do
		// special magic element rearranging 
		var t = this.getTableMisnestedNodePosition()
		if(!t.insertBefore) {
			t.parent.appendChild(element)
		} else {
			t.parent.insertBefore(element, t.insertBefore)
		}
		this.open_elements.push(element)
	} else {
		return this.insert_element_normal(name, attributes, namespace);
	}
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
        doctype.nodeName = name?name:'';
        doctype.publicId = publicId?publicId:null;
        doctype.systemId = systemId?systemId:null;
	this.document.appendChild(doctype);
}
	

b.prototype.insert_text = function(data, parent) {
	HTML5.debug('treebuilder.insert_text', data)
	if(!parent) parent = this.open_elements.last();
	if(!this.insert_from_table || HTML5.TABLE_INSERT_MODE_ELEMENTS.indexOf(this.open_elements.last().tagName) == -1) {
		if(parent.lastChild && parent.lastChild.nodeType == DOM.Node.TEXT_NODE) {
			parent.lastChild.appendData(data);
		} else {
			var tn = this.document.createTextNode(data);
			parent.appendChild(tn);
		}
	} else {
		HTML5.debug('treebuilder.insert_text', 'voodoo invoked')
		// We should be in the inTable phase. This means we want to do special
		// magic element rearranging.
		var t = this.getTableMisnestedNodePosition();
		insertText(t.parent, data, t.insertBefore)
	}
}

function insertText(node, data, before) {
	var t = node.ownerDocument.createTextNode(data)
	if(before) {
		if(before.previousSibling.nodeType == DOM.Node.TEXT_NODE) {
			before.previousSibling.nodeValue += data;
		} else {
			node.insertBefore(t, before)
		}
	} else {
		node.appendChild(t)
	}
}

b.prototype.getTableMisnestedNodePosition = function() {
	// The foster parent element is the one which comes before the most
	// recently opened table element
	// XXX - this is really inelegant
	var lastTable, fosterParent, insertBefore
	
	for(var i = this.open_elements.length - 1; i >= 0; i--) {
		var element = this.open_elements[i]
		if(element.tagName == 'table') {
			lastTable = element
			break
		}
	}

	if(lastTable) {
		// XXX - we should check that the parent really is a node here
		if(lastTable.parentNode) {
			fosterParent = lastTable.parentNode
			insertBefore = lastTable
		} else {
			fosterParent = this.open_elements[this.open_elements.indexOf(lastTable) - 1]
		}
	} else {
		fosterParent = this.open_elements[0]
	}
	
	return {parent: fosterParent, insertBefore: insertBefore}
}

b.prototype.elementInScope = function(name, tableVariant) {
	HTML5.debug('treebuilder.elementInScope', name, tableVariant)
	if(this.open_elements.length == 0) return false
	if(this.open_elements.last().tagName == name) return true
	for(var i = this.open_elements.length - 1; i >= 0; i--) {
		if(this.open_elements[i].tagName == name) return true
		else if(this.open_elements[i].tagName == 'table') return false
		else if(!tableVariant && HTML5.SCOPING_ELEMENTS.indexOf(this.open_elements[i].tagName) != -1) return false
		else if(this.open_elements[i].tagName == 'html') return false;
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
	HTML5.debug('treebuilder.reconstructActiveFormattingElements', 'before', HTML5.dumpTagStack(this.activeFormattingElements))
	// Within this algorithm the order of steps decribed in the specification
	// is not quite the same as the order of steps in the code. It should still
	// do the same though.

	// Step 1: stop if there's nothing to do
	if(this.activeFormattingElements.length == 0) return;

	// Step 2 and 3: start with the last element
	var i = this.activeFormattingElements.length - 1;
	var entry = this.activeFormattingElements[i];
	if(entry == HTML5.Marker || this.open_elements.indexOf(entry) != -1) return;

	while(entry != HTML5.Marker && this.open_elements.indexOf(entry) == -1) {
		i -= 1;
		entry = this.activeFormattingElements[i];
		if(!entry) break;
	}

	while(true) {
		i += 1;
		var clone = this.activeFormattingElements[i].cloneNode();
		HTML5.debug('treebuilder.reconstructActiveFormattingElements', 'cloneNode', clone.tagName)

		var element = this.insert_element(clone.tagName, clone.attributes);

		this.activeFormattingElements[i] = element;

		if(element == this.activeFormattingElements.last()) break;
	}

	HTML5.debug('treebuilder.reconstructActiveFormattingElements', 'open tags are ' + HTML5.dumpTagStack(this.open_elements));
}

b.prototype.elementInActiveFormattingElements = function(name) {
	var els = this.activeFormattingElements;
	for(var i = els.length - 1; i >= 0; i--) {
		if(els[i] == HTML5.Marker) break;
		if(els[i].tagName == name) return els[i];
	}
	return false;
}

b.prototype.reparentChildren = function(o, n) {
	while(o.childNodes.length > 0) {
		var el = o.removeChild(o.childNodes[0]);
		n.appendChild(el);
	}
}

b.prototype.clearActiveFormattingElements = function() {
	HTML5.debug('treebuilder.clearActiveFormattingElements', 'before', HTML5.dumpTagStack(this.activeFormattingElements))
	while(!(this.activeFormattingElements.length == 0 || this.activeFormattingElements.pop() == HTML5.Marker));
	HTML5.debug('treebuilder.clearActiveFormattingElements', 'after', HTML5.dumpTagStack(this.activeFormattingElements))
}

b.prototype.getFragment = function() {
	// assert.ok(this.parser.inner_html)
	var fragment = this.document.createDocumentFragment()
	this.reparentChildren(this.open_elements[0], fragment)
	return fragment
}
