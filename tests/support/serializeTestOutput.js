var dom = require('dom');
var walker = require('html5').HTML5.TreeWalker;

exports.serializeTestOutput = function(doc) {
	var s = '';
	var indent = '';
	new walker(doc, function(token) {
		switch(token.type) {
		case 'StartTag':
			s += indent + '<' + token.name + ">\n";
			indent += '  ';
			break;
		case 'EmptyTag':
			s += indent + '<' + token.name + '>\n';
			break;
		case 'EndTag':
			indent = indent.slice(2);
			break;
		case 'Characters':
			s += indent + '"' + token.data + '"\n';
			break;
		case 'Comment':
			s += indent + '<!--' + token.data + '-->\n';
			break;
		case 'Doctype':
			s += indent + '<!DOCTYPE ' + token.name + '>\n';
			break;
		}
	});
	return s;
}
