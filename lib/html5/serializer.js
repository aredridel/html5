var HTML5 = require('html5');
var events = require('events');

function keys(o) {
	var r = [];
	for(var k in o) {
		r.push(k);
	}
	return r;
}

function hescape(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

HTML5.serialize = function(src, target) {
	var dest;
	if(target instanceof Function) {
		dest = new events.EventEmitter();
		dest.addListener('data', target);
	} else if(typeof target == 'undefined') {
		dest = new events.EventEmitter();
		var ret = '';
		dest.addListener('data', function(d) {
			ret += d;
		});
	} else {
		dest = target;
	}
	var strict = false;
	var errors = [];

	function serialize_error(data) {
		errors.push(data);
		if(strict) throw(data);
	}
		
	var in_cdata = false;
	//TODO: Filters
	var doctype;
	var escape_rcdata = false;
	var w = new HTML5.TreeWalker(src, function(tok) {
		if(tok.type == "Doctype") {
			doctype = "<!DOCTYPE " + tok.name + ">";
			dest.emit('data', doctype);
		} else if(tok.type == 'Characters' || tok.type == 'SpaceCharacters') {
			if(in_cdata || tok.type == 'SpaceCharacters') {
				if(in_cdata && token.data.indexOf("</") != -1) {
					serialize_error("Unexpected </ in CDATA")
				}
				dest.emit('data', tok.data);
			} else {
				if(tok.data) dest.emit('data', hescape(tok.data));
			}
		} else if(tok.type == "StartTag" || tok.type == 'EmptyTag') {
			if(HTML5.RCDATA_ELEMENTS.indexOf(tok.name) != -1 && !escape_rcdata) {
				in_cdata = true;
			} else if (in_cdata) {
				serialize_error("Unexpected child element of a CDATA element");
			}

			var attributes = "";
			var attrs= keys(tok.data).sort();
			for(k in attrs) {
				var quote_attr = false;
				v = tok.data[k];
				attributes += " "+k;
				if(!minimize_boolean_attributes || ((HTML5.BOOLEAN_ATTRIBUTES[tok.name] || []).indexOf(k) == -1 && (HTML5.BOOLEAN_ATTRIBUTES["_global"].indexOf(k) == -1))) {
					attributes += "=";
					if(quote_attr_values || v.length == 0) {
						quote_attr = true;
					} else {
						quote_attr = new RegExp("[" + HTML5.SPACE_CHARACTERS_IN + "<>'\"" + "]").test(v)
					}

					v = v.replace(/&/g, '&amp;');
					if(escape_lt_in_attrs) v = v.replace(/</g, '&lt;');
					if(quote_attr) {
						var the_quote_char = quote_char;
						if(use_best_quote_char) {
							if(v.indexOf("'") != -1 && v.indexOf('"') == -1) {
								the_quote_char = '"';
							} else if(v.indexOf('"') != -1 && v.indexOf("'") == -1) {
								the_quote_char = "'"
							}
						}
						if(quote_char == '"') {
							v = v.replace(/"/g, '&quot;');
						} else {
							v = v.replace(/'/g, '&#39;');
						}
						attributes += the_quote_char + v + the_quote_char;
					} else {
						attributes += v;
					}
				}
			}

			if(HTML5.VOID_ELEMENTS.indexOf(tok.name) != -1 && use_trailing_solidus) {
				if(space_before_trailing_solidus) {
					attributes += " /";
				} else {
					attributes += "/";
				}
			}

			dest.emit('data', "<" + tok.name + attributes + ">");

		} else if(tok.type == 'EndTag') {
			if(HTML5.RCDATA_ELEMENTS.indexOf(tok.name) != -1) {
				in_cdata = false;
			} else if(in_cdata) {
				serialize_error("Unexpected child element of a CDATA element");
			}
			dest.emit('data', '</' + tok.name + '>');
		} else if(tok.type == 'Comment') {
			if(tok.data.match(/--/)) serialize_error("Comment contains --");
			dest.emit('data', '<!--' + tok.data + '-->');
		} else {
			serialize_error(tok.data);
		}
	});

	if(ret) return ret;
}
