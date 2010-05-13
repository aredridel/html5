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
			var a = []
			for(var i in token.data) {
				a.push(i)
			}
			a = a.sort()
			for(var i in a) {
				s += indent + a[i] + '="' + token.data[a[i]] + '"\n'
			}
			break;
		case 'EmptyTag':
			s += indent + '<' + token.name + '>\n';
			for(var i in token.data) {
				s += indent + "  " + i + '="' + token.data[i] + '"\n'
			}
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
