var dom = require('dom');
var HTML5 = require('html5');
var walker = HTML5.TreeWalker;

exports.serializeTestOutput = function(doc) {
	var s = '';
	var indent = '';
	new walker(doc, function(token) {
		switch(token.type) {
		case 'StartTag':
			s += indent + '<' + token.name + ">\n";
HTML5.debug('serialize', token)
			indent += '  ';
			for(var i in token.data) {
				s += indent + i + '="' + token.data[i] + '"\n'
			}
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
			s += indent + '<!-- ' + token.data + ' -->\n';
			break;
		case 'Doctype':
			s += indent + '<!DOCTYPE ' + token.name + '>\n';
			break;
		}
	});
	return s;
}
