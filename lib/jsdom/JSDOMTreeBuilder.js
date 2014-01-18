var util = require('util');
var TreeBuilder = require('../TreeBuilder').TreeBuilder;

function JSDOMTreeBuilder(document) {
	TreeBuilder.call(this);
	this.document = document;
}

util.inherits(JSDOMTreeBuilder, TreeBuilder);

JSDOMTreeBuilder.prototype.start = function() {

};

JSDOMTreeBuilder.prototype.insertDoctype = function(name, publicId, systemId) {
	var doctype = this.document.implementation.createDocumentType(name, publicId, systemId);
	this.document.appendChild(doctype);
};

JSDOMTreeBuilder.prototype.insertComment = function(data, parent) {
	if (!parent)
		parent = this.currentStackItem().node();
	var comment = this.document.createComment(data);
	parent.appendChild(comment);
};

JSDOMTreeBuilder.prototype.appendCharacters = function(parent, data) {
	var lastChild = parent.lastChild;
	if (lastChild && lastChild.nodeType == lastChild.TEXT_NODE) {
		lastChild.appendData(data);
		return;
	}
	parent.appendChild(this.document.createTextNode(data));
};

JSDOMTreeBuilder.prototype.insertText = function(data) {
	if (this.redirectAttachToFosterParent && this.openElements.top.isFosterParenting()) {
		var tableIndex = this.openElements.findIndex('table');
		var tableItem = this.openElements.item(tableIndex);
		var table = tableItem.node;
		if (tableIndex === 0) {
			return this.appendCharacters(table, data);
		}
		var parent = table.parentNode;
		if (parent) {
			var previousSibling = table.previousSibling;
			if (previousSibling && previousSibling.nodeType === previousSibling.TEXT_NODE) {
				previousSibling.appendData(data);
				return;
			}
			parent.insertBefore(this.document.createTextNode(data), table);
			return;
		}
		var stackParent = this.openElements.item(tableIndex - 1).node;
		var lastChild = stackParent.lastChild;
		if (listChild && lastChild.nodeType == lastChild.TEXT_NODE) {
			lastChild.appendChild(data);
			return;
		}
		stackParent.appendChild(this.document.createTextNode(data));
		return;
	}
	this.appendCharacters(this.currentStackItem().node, data);
};

JSDOMTreeBuilder.prototype.createElement = function(namespaceURI, localName, attributes) {
	var element = (this.document._elementBuilders[localName] || this.document._defaultElementBuilder)(this.document, localName);

	element._created = false;

	element._namespaceURI = namespaceURI;
	element._nodeName = localName;
	element._localName = localName;
	element._created = true;

	if (attributes) {
		for (var i = 0; i < attributes.length; i++) {
			element.setAttributeNS(attributes[i].namespaceURI || null,
				attributes[i].nodeName, attributes[i].nodeValue);
		}
	}
	return element;
};

JSDOMTreeBuilder.prototype.attachNode = function(child, parent) {
	parent.appendChild(child);
};

JSDOMTreeBuilder.prototype.attachNodeToFosterParent = function(child, table, stackParent) {
	var parent = table.parentNode;
	if (parent)
		parent.insertBefore(child, table);
	else
		stackParent.appendChild(child);
};

JSDOMTreeBuilder.prototype.detachFromParent = function(node) {
	var parent = node.parentNode;
	if (parent)
		parent.removeChild(node);
};

JSDOMTreeBuilder.prototype.reparentChildren = function(oldParent, newParent) {
	while (oldParent.hasChildNodes()) {
		newParent.appendChild(oldParent.firstChild);
	}
};

TreeBuilder.prototype.getFragment = function() {
	var fragment = this.document.createDocumentFragment();
	this.reparentChildren(this.openElements.rootNode, fragment);
	return fragment;
};

JSDOMTreeBuilder.prototype.addAttributesToElement = function(element, attributes) {
	for (var i = 0; i < attributes.length; i++) {
		if (!element.getAttributeNS(attributes[i].namespaceURI || null, attributes[i].nodeName)) {
			element.setAttributeNS(attributes[i].namespaceURI || null, attributes[i].nodeName, attributes[i].nodeValue);
		}
	}
};

exports.JSDOMTreeBuilder = JSDOMTreeBuilder;