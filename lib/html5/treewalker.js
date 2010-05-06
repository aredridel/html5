var HTML5 = require('html5');
var events = require('events');
var dom = require('dom');
var sys = require('sys');

function error(msg) {
	return {type: 'SerializeError', data: msg};
}

function normalize_attrs(attrs) {
	var o = {}
HTML5.debug('treewalker.attributes', attrs);
	if(attrs) for(var i = 0; i < attrs.length; i++) {
		o[attrs[i].nodeName] = attrs[i].nodeValue;
	}
	return o;
	// FIXME
}

function empty_tag(name, attrs, has_children) {
	if(has_children) return error(_("Void element has children"));
	return {type: 'EmptyTag', name: name, data: normalize_attrs(attrs)};
}

function start_tag(node) {
	return {type: 'StartTag', name: node.tagName, data: normalize_attrs(node.attributes)};
}

function end_tag(name) {
	return {type: 'EndTag', name: name };
}

function text(data, target) {
	if(m = new RegExp("^[" + HTML5.SPACE_CHARACTERS + "]+").exec(data)) {
		target.emit('token', {type: 'SpaceCharacters', data: m[0]});
		data = data.slice(m[0].length, data.length);
		if(data.length == 0) return;
	}
	
	if(m = new RegExp("["+HTML5.SPACE_CHARACTERS + "]+$").exec(data)) {
		target.emit('token', {type: 'Characters', data: data.slice(0, m.length)});
		target.emit('token', {type: 'SpaceCharacters', data: data.slice(m.index, data.length)});
	} else {
		target.emit('token', {type: 'Characters', data: data});
	}
}

function comment(data) {
	return {type: 'Comment', data: data};
}

function doctype(node) {
	return {type: 'Doctype', name: node.nodeName, publicId: node.publicId, systemId: node.systemId, correct: node.correct};
}

function unknown(node) {
	return error(_("unknown node: ")+ require('sys').inspect(node));
}

function _(str) {
	return str;
}

HTML5.TreeWalker = function(document, dest) {
	if(dest instanceof Function) this.addListener('token', dest);
	walk(document, this);
};

function walk(node, dest) {
	switch(node.nodeType) {
	case dom.Node.DOCUMENT_FRAGMENT_NODE:
	case dom.Node.DOCUMENT_NODE:
		for(var child = 0; child < node.childNodes.length; ++child) {
			walk(node.childNodes[child], dest);
		}
		break;
	
	case dom.Node.ELEMENT_NODE:
		if(HTML5.VOID_ELEMENTS.indexOf(node.tagName) != -1) {
			dest.emit('token', empty_tag(node.tagName, node.attributes, node.hasChildNodes()));
		} else {
			dest.emit('token', start_tag(node));
			for(var child = 0; child < node.childNodes.length; ++child) {
				walk(node.childNodes[child], dest);
			}
			dest.emit('token', end_tag(node.tagName));
		}
		break;

	case dom.Node.TEXT_NODE:
		text(node.nodeValue, dest);
		break;

	case dom.Node.COMMENT_NODE:
		dest.emit('token', comment(node.nodeValue));
		break;

	case dom.Node.DOCTYPE_NODE:
		dest.emit('token', doctype(node));
		break;

	default:
		dest.emit('token', unknown(node));
	}
}		

HTML5.TreeWalker.prototype = new events.EventEmitter;
