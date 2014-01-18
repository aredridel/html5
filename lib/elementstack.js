var ScopingElements = {
	"http://www.w3.org/1999/xhtml": [
		'applet',
		'caption',
		'html',
		'table',
		'td',
		'th',
		'marquee',
		'object'
	],
	"http://www.w3.org/1998/Math/MathML": [
		'mi',
		'mo',
		'mn',
		'ms',
		'mtext',
		'annotation-xml'
	],
	"http://www.w3.org/2000/svg": [
		'foreignObject',
		'desc',
		'title'
	]
};

var ListItemScopingElements = {
	"http://www.w3.org/1999/xhtml": [
		'ol',
		'ul',
		'applet',
		'caption',
		'html',
		'table',
		'td',
		'th',
		'marquee',
		'object'
	],
	"http://www.w3.org/1998/Math/MathML": [
		'mi',
		'mo',
		'mn',
		'ms',
		'mtext',
		'annotation-xml'
	],
	"http://www.w3.org/2000/svg": [
		'foreignObject',
		'desc',
		'title'
	]
};

var ButtonScopingElements = {
	"http://www.w3.org/1999/xhtml": [
		'button',
		'applet',
		'caption',
		'html',
		'table',
		'td',
		'th',
		'marquee',
		'object'
	],
	"http://www.w3.org/1998/Math/MathML": [
		'mi',
		'mo',
		'mn',
		'ms',
		'mtext',
		'annotation-xml'
	],
	"http://www.w3.org/2000/svg": [
		'foreignObject',
		'desc',
		'title'
	]
};

var TableScopingElements = {
	"http://www.w3.org/1999/xhtml": ['table', 'html']
};

var TableBodyScopingElements = {
	"http://www.w3.org/1999/xhtml": ['tbody', 'tfoot', 'thead', 'html']
};

var TableRowScopingElements = {
	"http://www.w3.org/1999/xhtml": ['tr', 'html']
};

var SelectScopingElements = {
	"http://www.w3.org/1999/xhtml": ['option', 'optgroup']
};

function isScopeMarker(node, scopingElements) {
	var scopingLocalNames = scopingElements[node.namespaceURI];
	return scopingLocalNames && scopingLocalNames.indexOf(node.localName) >= 0;
}

function ElementStack() {
	this.elements = [];
	this.rootNode = null;
	this.headElement = null;
	this.bodyElement = null;
}

ElementStack.prototype._inScope = function(localName, scopingElements) {
	for (var i = this.elements.length - 1; i >= 0; i--) {
		var node = this.elements[i];
		if (node.localName === localName)
			return true;
		if (isScopeMarker(node, scopingElements))
			return false;
	}
};

/**
 * Pushes the item on the stack top
 * @param {StackItem} item
 */
ElementStack.prototype.push = function(item) {
	this.elements.push(item);
};

/**
 * Pushes the item on the stack top
 * @param {StackItem} item HTML element stack item
 */
ElementStack.prototype.pushHtmlElement = function(item) {
	this.rootNode = item.node;
	this.push(item);
};

/**
 * Pushes the item on the stack top
 * @param {StackItem} item HEAD element stack item
 */
ElementStack.prototype.pushHeadElement = function(item) {
	this.headElement = item.node;
	this.push(item);
};

/**
 * Pushes the item on the stack top
 * @param {StackItem} item BODY element stack item
 */
ElementStack.prototype.pushBodyElement = function(item) {
	this.bodyElement = item.node;
	this.push(item);
};

/**
 * Pops the topmost item
 * @return {StackItem}
 */
ElementStack.prototype.pop = function() {
	return this.elements.pop();
};

/**
 * Removes the item from the element stack
 * @param {StackItem} item The item to remove
 */
ElementStack.prototype.remove = function(item) {
	this.elements.splice(this.elements.indexOf(item), 1);
};

ElementStack.prototype.popUntilPopped = function(localName) {
	var element;
	do {
		element = this.pop();
	} while (element.localName != localName);
};

ElementStack.prototype.popUntilTableScopeMarker = function() {
	while (!isScopeMarker(this.top, TableScopingElements))
		this.pop();
};

ElementStack.prototype.popUntilTableBodyScopeMarker = function() {
	while (!isScopeMarker(this.top, TableBodyScopingElements))
		this.pop();
};

ElementStack.prototype.popUntilTableRowScopeMarker = function() {
	while (!isScopeMarker(this.top, TableRowScopingElements))
		this.pop();
};

ElementStack.prototype.item = function(index) {
	return this.elements[index];
};

ElementStack.prototype.contains = function(element) {
	return this.elements.indexOf(element) !== -1;
};

ElementStack.prototype.inScope = function(localName) {
	return this._inScope(localName, ScopingElements);
};

ElementStack.prototype.inListItemScope = function(localName) {
	return this._inScope(localName, ListItemScopingElements);
};

ElementStack.prototype.inTableScope = function(localName) {
	return this._inScope(localName, TableScopingElements);
};

ElementStack.prototype.inButtonScope = function(localName) {
	return this._inScope(localName, ButtonScopingElements);
};

ElementStack.prototype.inSelectScope = function(localName) {
	return this._inScope(localName, SelectScopingElements);
};

ElementStack.prototype.hasNumberedHeaderElementInScope = function() {
	for (var i = this.elements.length - 1; i >= 0; i--) {
		var node = this.elements[i];
		if (node.isNumberedHeader())
			return true;
		if (isScopeMarker(node, ScopingElements))
			return false;
	}
};

ElementStack.prototype.furthestBlockForFormattingElement = function(element) {
	var furthestBlock = null;
	for (var i = this.elements.length - 1; i >= 0; i--) {
		var node = this.elements[i];
		if (node.node === element)
			return furthestBlock;
		if (node.isSpecial())
			furthestBlock = node;
	}
};

ElementStack.prototype.findIndex = function(localName) {
	for (var i = this.elements.length - 1; i >= 0; i--) {
		if (this.elements[i].localName == localName)
			return i;
	}
};

ElementStack.prototype.remove_openElements_until = function(callback) {
	var finished = false;
	var element;
	while (!finished) {
		element = this.elements.pop();
		finished = callback(element);
	}
	return element;
};

Object.defineProperty(ElementStack.prototype, 'top', {
	get: function() {
		return this.elements[this.elements.length - 1];
	}
});

Object.defineProperty(ElementStack.prototype, 'length', {
	get: function() {
		return this.elements.length;
	}
});

exports.ElementStack = ElementStack;
