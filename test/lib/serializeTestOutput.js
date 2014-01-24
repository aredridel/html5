var foreignNamespaces = {
	"http://www.w3.org/2000/svg": 'svg',
	"http://www.w3.org/1998/Math/MathML": 'math'
};

exports.serializeTestOutput = function(doc) {
	var s = '';
	var indent = '';

	function walk(node) {
		switch (node.nodeType) {
			case node.DOCUMENT_FRAGMENT_NODE:
			case node.DOCUMENT_NODE:
				for (var child = 0; child < node.childNodes.length; child++) {
					walk(node.childNodes[child]);
				}
				break;
			case node.ELEMENT_NODE:
				var ns = '';
				if (node.namespaceURI in foreignNamespaces) {
					ns = foreignNamespaces[node.namespaceURI] + ' ';
				}
				s += indent + '<' + ns + node.localName + ">\n";
				indent += '  ';
				var attrs = [];
				for (var i = 0; i < node.attributes.length; i++) {
					attrs.push(node.attributes.item(i));
				}
				attrs = attrs.sort(function(a1, a2) {
					if ( a1.nodeName < a2.nodeName) return -1;
					if ( a1.nodeName > a2.nodeName) return 1;
					if ( a1.nodeName == a2.nodeName) return 0;
				});
				for (var i = 0; i < attrs.length; i++) {
					s += indent + attrs[i].nodeName + '="' + attrs[i].nodeValue + '"\n';
				}
				for (var child = 0; child < node.childNodes.length; child++) {
					walk(node.childNodes[child]);
				}
				indent = indent.slice(2);
				break;
			case node.TEXT_NODE:
				s += indent + '"' + node.nodeValue + '"\n';
				break;
			case node.COMMENT_NODE:
				s += indent + '<!-- ' + node.nodeValue + ' -->\n';
				break;
			case node.DOCUMENT_TYPE_NODE:
				s += indent + '<!DOCTYPE ' + node.nodeName;
				if (node.publicId || node.systemId) {
					s += ' "' + node.publicId + '" "' + node.systemId + '"';
				}
				s += '>\n';
				break;
		}
	}

	walk(doc);

	return s;
};