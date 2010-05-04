require('core-upgrade');
var HTML5 = require('html5');
var events = require('events');
var Buffer = require('html5/buffer').Buffer;
var Models = HTML5.Models;

function keys(h) {
	var r = [];
	for(var k in h) {
		r.push(k);
	}
	return r;
}

HTML5.Tokenizer = t = function HTML5Tokenizer(input, ready) {
	HTML5.debug('tokenizer', 'initializing tokenizer');
	this.content_model = Models.PCDATA;
	var state;
	var buffer = this.buffer = new Buffer();
	this.__defineSetter__('state', function(newstate) {
		HTML5.debug('tokenizer.state', newstate)
		state = newstate;
		buffer.commit();
	});
	this.state = 'data_state';
	this.escapeFlag = false;
	this.lastFourChars = '';
	this.current_token = null;

	if(typeof(input) == 'string') {
		var source = new events.EventEmitter();
	} else {
		var source = input;
	}
	
	this.commit = function() {
		buffer.commit();
	};

	if(ready) ready(this);

	var tokenizer = this;
	source.addListener('data', function(data) {
		if(typeof data !== 'string') data = data.toString();
		buffer.append(data);
		try {
			while(buffer.length() > 0) tokenizer[state](buffer);
		} catch(e) {
		       if(e != 'drain') {
				HTML5.debug('tokenizer.error', "Got an exception while tokenizing -- " + e );
			       throw(e);
		       } else {
			       buffer.undo();
		       }
		}
	});
	source.addListener('end', function() {
		buffer.eof = true;
		while(tokenizer[state](buffer));
	});

	if(source != input) {
		source.emit('data', input);
		source.emit('end');
	}
}

t.prototype = new events.EventEmitter;

t.prototype.emitToken = function(tok) { 
	HTML5.debug('tokenizer.emitToken', tok);
	this.emit('token', tok);
}

t.prototype.consume_entity = function(buffer, from_attr) {
	HTML5.debug('tokenizer', 'consume_entity');
	var char = null;
	var chars = buffer.shift(1);
	// FIXME: no EOF handling in this function
	if(chars.match(HTML5.SPACE_CHARACTERS) || chars == '<' || chars == '&') {
		buffer.unget(chars);
	} else if(chars.match(/^#/)) { // Maybe a numeric entity
		chars = chars + buffer.shift(2);
		if(chars[1].toLowerCase() == 'x' && HTML5.HEX_DIGITS_R.test(chars[2])) {
			// Hex entity
			buffer.unget(chars[2]);
			char = this.consume_numeric_entity(buffer, true);
		} else if(HTML5.DIGITS.test(chars[1])) {
			// Decimal entity
			buffer.unget(chars.slice(1));
			char = this.consume_numeric_entity(buffer, false);
		} else {
			// Not numeric
			buffer.unget(chars);
			this.parse_error("expected-numeric-entity");
		}
	} else {
		var filteredEntityList = keys(HTML5.ENTITIES).filter(function(e) {
			return e[0] == chars[0];
		});
		var entityName = null;
		while(true) {
			var name = chars;
			if(filteredEntityList.some(function(e) {
				return e.indexOf(name) == 0;
			})) {
				filteredEntityList = filteredEntityList.filter(function(e) {
					return e.indexOf(name) != 0;
				});
			} else {
				break;
			}

			if(HTML5.ENTITIES[name]) {
				entityName = name;
				if(entityName[entityName.length - 1] == ';') break;
			}
		} 

		if(entityName) {
			char = HTML5.ENTITIES[entityName];

			if(entityName[entityName.length - 1] != ';' && from_attribute && (HTML5.ASCII_LETTERS.test(chars.substr(entityName.length, 1) || HTML5.DIGITS.test(chars.substr(entityName.length, 1))))) {
				buffer.unget(chars);
				char = '&';
			} else {
				buffer.unget(chars.slice(entityName.length));
			}
		} else {
			this.parse_error("expected-named-entity");
			buffer.unget(chars);
		}
	}

	return char;
}

t.prototype.consume_numeric_entity = function(buffer, hex) {
	HTML5.debug('tokenizer', 'consume_numeric_entity');
	if(hex) {
		var allowed = HTML5.HEX_DIGITS_R;
		var radix = 16;
	} else {
		var allowed = HTML5.DIGITS_R;
		var radix = 10;
	}

	chars = '';

	var c = buffer.shift(1);
	while(allowed.test(c)) {
		chars = chars + c;
		c = buffer.shift(1);
	}

	var charAsInt = parseInt(chars, radix);

	if(charAsInt == 13) {
		this.parse_error("incorrect-cr-newline-entity");
		charAsInt = 10;
	} else if(charAsInt >= 128 && charAsInt <= 159) {
		this.parse_error("illegal-windows-1252-entity");
		charAsInt = HTML5.WINDOWS1252[charAsInt - 128];
	} 
	
	if(0 < charAsInt && charAsInt <= 1114111 && !(55296 <= charAsInt && charAsInt <= 57343)) {
		char = String.fromCharCode(charAsInt);
	} else {
		char = String.fromCharCode(0xFFFD);
		this.parse_error("cant-convert-numeric-entity");
	} 

	if(c != ';') {
		this.parse_error("numeric-entity-without-semicolon");
		buffer.unget(c);
	} 

	return char;
}

t.prototype.process_entity_in_attribute = function(buffer) {
	HTML5.debug('tokenizer', 'process_entity_in_attribute');
	var entity = this.consume_entity(buffer);
	if(entity) {
		this.current_token.data.last()[1] += entity;
	} else {
		this.current_token.data.last()[1] += '&';
	}
}

t.prototype.process_solidus_in_tag = function(buffer) {
	HTML5.debug('tokenizer', 'process_solidus_in_tag');
	var data = buffer.peek(1);
	if(this.current_token.type == 'StartTag' && data == '>') {
		this.current_token.type = 'EmptyTag';
		buffer.shift(1);
		return true;
	} else {
		this.parse_error("incorrectly-placed-solidus");
		return false;
	}
}

t.prototype.data_state = function(buffer) {
	var c = buffer.shift(1);
	if(this.content_model == Models.CDATA || this.content_model == Models.RCDATA) {
		if(this.lastFourChars.length >= 4) {
			this.lastFourChars = this.lastFourChars.substr(-3) + c;
		} else {
			this.lastFourChars = this.lastFourChars + c;
		}
	}

	if(c == "&" && (this.content_model == Models.PCDATA || this.content_model == Models.RCDATA) && !this.escapeFlag) {
		this.state = 'entity_data_state';
	} else if(c == '-' && (this.content_model == Models.PCDATA || this.content_model == Models.RCDATA) && !this.escapeFlag && this.lastFourChars == '<!--') {
		this.escapeFlag = true;
		this.emitToken({type: 'Characters', data: c});
	} else if(c == '<' && !this.ecapeFlag && (this.content_model == Models.PCDATA || this.content_model == Models.RCDATA || this.content_model == Models.CDATA)) {
		this.state = 'tag_open_state';
	} else if(c == '>' && this.escapeFlag && (this.content_model == Models.CDATA || this.content_model == Models.RCDATA) && this.lastFourChars.slice(1, 3) == '-->') {
		this.escapeFlag = false;
		this.emitToken({type: 'Characters', data: c});
	} else if(HTML5.SPACE_CHARACTERS_R.test(c)) {
		this.emitToken({type: 'SpaceCharacters', data: c + buffer.matchWhile(HTML5.SPACE_CHARACTERS_R)});
		this.commit();
	} else if(c == HTML5.EOF) {
		this.emitToken(HTML5.EOF);
		return false;
	} else {
		this.emitToken({type: 'Characters', data: c + buffer.matchUntil("[&<>-]")});
		// FIXME: this.lastFourChars stuff
	}
	return true;
}

t.prototype.entity_data_state = function(buffer) {
	var entity = this.consume_entity(buffer);
	if(entity) {
		this.emitToken({type: 'Characters', data: entity});
	} else {
		this.emitToken({type: 'Characters', data: '&'});
	}
	this.state = 'data_state';
	return true;
}

t.prototype.tag_open_state = function(buffer) {
	var data = buffer.shift(1);
	if(this.content_model == Models.PCDATA) {
		if(data == '!') {
			this.state = 'markup_declaration_open_state';
		} else if (data == '/') {
			this.state = 'close_tag_open_state';
		} else if (data != HTML5.EOF && HTML5.ASCII_LETTERS_R.test(data)) {
			this.current_token = {type: 'StartTag', name: data, data: []};
			this.state = 'tag_name_state';
		} else if (data == '>') {
			// XXX In theory it could be something besides a tag name. But
			// do we really care?
			this.parse_error("expected-tag-name-but-got-right-bracket");
			this.emitToken({type: 'Characters', data: "<>"});
			this.state = 'data_state';
		} else if (data == '?') {
			// XXX In theory it could be something besides a tag name. But
			// do we really care?
			this.parse_error("expected-tag-name-but-got-question-mark");
			buffer.unget(data);
			this.state = 'bogus_comment_state';
		} else {
			// XXX
			this.parse_error("expected-tag-name");
			this.emitToken({type: 'Characters', data: "<"});
			buffer.unget(data);
			this.state = 'data_state';
		}
	} else {
		// We know the content model flag is set to either RCDATA or CDATA
		// now because this state can never be entered with the PLAINTEXT
		// flag.
		if (data == '/') {
			this.state = 'close_tag_open_state';
		} else {
			this.emitToken({type: 'Characters', data: "<"});
			buffer.unget(data);
			this.state = 'data_state';
		}
	}
	return(true);
}

t.prototype.close_tag_open_state = function(buffer) {
	if(this.content_model == Models.RCDATA || this.content_model == Models.CDATA) {
		var chars = '';
		if(this.current_token) {
			chars = buffer.peek(this.current_token.name.length + 1);
			// FIXME: EOF can occur here, and this is really to peek and see if we have it.
		}

		if(this.current_token && this.current_token.name.toLowerCase() == chars.substr(0, chars.length - 1).toLowerCase() && new RegExp('[' + HTML5.SPACE_CHARACTERS_IN + '></]').test(chars.substr(-1))) {
			this.content_model = Models.PCDATA;
		} else {
			this.emitToken({type: 'Characters', data: '</'});
			this.state = 'data_state';
			return;
		}
	}

	data = buffer.shift(1);
	if (data == HTML5.EOF) { 
		this.parse_error("expected-closing-tag-but-got-eof");
		this.emitToken({type: 'Characters', data: '</'});
		this.state = this.data_state
	} else if (HTML5.ASCII_LETTERS_R.test(data)) {
		this.current_token = {type: 'EndTag', name: data, data: []};
		this.state = 'tag_name_state';
	} else if (data == '>') {
		this.parse_error("expected-closing-tag-but-got-right-bracket");
		this.state = 'data_state';
	} else {
		this.parse_error("expected-closing-tag-but-got-char", {data: data}); // param 1 is datavars:
		buffer.unget(data);
		this.state = 'bogus_comment_state';
	}
	return true;
}

t.prototype.tag_name_state = function(buffer) {
	data = buffer.shift(1);
	if(HTML5.SPACE_CHARACTERS_R.test(data)) {
		this.state = 'before_attribute_name_state';
	} else if(data == HTML5.EOF) {
		this.parse_error('eof-in-tag-name');
		this.emit_current_token();
	} else if(HTML5.ASCII_LETTERS_R.test(data)) {
		this.current_token.name += data + buffer.matchWhile(HTML5.ASCII_LETTERS);
	} else if(data == '>') {
		this.emit_current_token();
	} else if(data == '/') {
		this.state = 'self_closing_tag_state';
	} else { 
		this.current_token.name += data;
	}
	this.commit();

	return true;
}

t.prototype.before_attribute_name_state = function(buffer) {
	var data = buffer.shift(1);
	if(HTML5.SPACE_CHARACTERS_R.test(data)) {
		buffer.matchWhile(HTML5.SPACE_CHARACTERS_R);
	} else if (data == HTML5.EOF) {
		this.parse_error("expected-attribute-name-but-got-eof");
		this.emit_current_token();
	} else if (HTML5.ASCII_LETTERS_R.test(data)) {
		this.current_token.data.push([data, ""]);
		this.state = 'attribute_name_state';
	} else if(data == '>') {
		this.emit_current_token();
	} else if(data == '/') {
		this.state = 'self_closing_tag_state';
	} else if(data == "'" || data == '"' || data == '=') {
		this.parse_error("invalid-character-in-attribute-name");
		this.current_token.data.push([data, ""]);
		this.state = 'attribute_name_state';
	} else {
		this.current_token.data.push([data, ""]);
		this.state = 'attribute_name_state';
	}
	return true;
}

t.prototype.attribute_name_state = function(buffer) {
	var data = buffer.shift(1);
	var leavingThisState = true;
	var emitToken = false;
	if(data == '=') {
		this.state = 'before_attribute_value_state';
	} else if(data == HTML5.EOF) {
		this.parse_error("eof-in-attribute-name");
		this.state = 'data_state';
		emitToken = true;
	} else if(HTML5.ASCII_LETTERS_R.test(data)) {
		this.current_token.data.last()[0] += data + buffer.matchWhile(HTML5.ASCII_LETTERS_R);
		leavingThisState = false;
	} else if(data == '>') {
		// XXX If we emit here the attributes are converted to a dict
		// without being checked and when the code below runs we error
		// because data is a dict not a list
		emitToken = true;
	} else if(HTML5.SPACE_CHARACTERS_R.test(data)) {
		this.state = 'after_attribute_name_state';
	} else if(data == '/') {
		if(!this.process_solidus_in_tag(buffer)) {
			this.state = 'before_attribute_name_state';
		}
	} else if(data == "'" || data == '"') {
		this.parse_error("invalid-character-in-attribute-name");
		this.current_token.data.last()[0] += data;
		leavingThisState = false;
	} else {
		this.current_token.data.last()[0] += data;
		leavingThisState = false;
	}

	if(leavingThisState) {
		// Attributes are not dropped at this stage. That happens when the
		// start tag token is emitted so values can still be safely appended
		// to attributes, but we do want to report the parse error in time.
		if(this.lowercase_attr_name) {
			this.current_token.data.last()[0] = this.current_token.data.last()[0].toLower();
		}
		for (k in this.current_token.data.slice(0, -1)) {
			// FIXME this is a fucking mess.
			if(this.current_token.data.slice(-1)[0] == this.current_token.data.slice(0, -1)[k].name) {
				this.parse_error("duplicate-attribute");
				break; // Don't emit more than one of these errors
			}
		}
		if(emitToken) this.emit_current_token();
	}
	return true;
}

t.prototype.after_attribute_name_state = function(buffer) {
	var data = buffer.shift(1);
	if(HTML5.SPACE_CHARACTERS_R.test(data)) {
		buffer.matchWhile(HTML5.SPACE_CHARACTERS_R);
	} else if(data == '=') {
		this.state = 'before_attribute_value_state';
	} else if(data == '>') {
		this.emit_current_token();
	} else if(data == HTML5.EOF) {
		this.parse_error("expected-end-of-tag-but-got-eof");
		this.emit_current_token();
	} else if(HTML5.ASCII_LETTERS_R.test(data)) {
		this.current_token.data.push([data, ""]);
		this.state = 'attribute_name_state';
	} else if(data == '/') {
		this.state = 'self_closing_tag_state';
	} else {
		this.current_token.data.push([data, ""]);
		this.state = 'attribute_name_state';
	}
	return true;
}

t.prototype.before_attribute_value_state = function(buffer) {
	var data = buffer.shift(1);
	if(HTML5.SPACE_CHARACTERS_R.test(data)) {
		buffer.matchWhile(HTML5.SPACE_CHARACTERS_R);
	} else if(data == '"') {
		this.state = 'attribute_value_double_quoted_state';
	} else if(data == '&') {
		this.state = 'attribute_value_unquoted_state';
		buffer.unget(data);
	} else if(data == "'") {
		this.state = 'attribute_value_single_quoted_state';
	} else if(data == '>') {
		this.emit_current_token();
	} else if(data == '=') {
		this.parse_error("equals-in-unquoted-attribute-value");
		this.current_token.data.last()[1] += data;
		this.state = 'attribute_value_unquoted_state';
	} else if(data == HTML5.EOF) {
		this.parse_error("expected-attribute-value-but-got-eof");
		this.emit_current_token();
		this.state = 'attribute_value_unquoted_state';
	}
	return true;
}

t.prototype.attribute_value_double_quoted_state = function(buffer) {
	var data = buffer.shift(1);
	if(data == '"') {
		this.state = 'after_attribute_value_state';
	} else if(data == '&') {
		this.process_entity_in_attribute(buffer);
	} else if(data == HTML5.EOF) {
		this.parse_error("eof-in-attribute-value-double-quote");
		this.emit_current_token();
	} else {
		this.current_token.data.last()[1] += data + buffer.matchUntil('"&');
	}
	return true;
}

t.prototype.attribute_value_single_quoted_state = function(buffer) {
	var data = buffer.shift(1);
	if(data == "'") {
		this.state = 'after_attribute_value_state';
	} else if(data == '&') {
		this.process_entity_in_attribute(buffer);
	} else if(data == HTML5.EOF) {
		this.parse_error("eof-in-attribute-value-single-quote");
		this.emit_current_token();
	} else {
		this.current_token.data.last()[1] += data + buffer.matchUntil("'&");
	}
	return true;
}

t.prototype.attribute_value_unquoted_state = function(buffer) {
	var data = buffer.shift(1);
	if(HTML5.SPACE_CHARACTERS_R.test(data)) {
		this.state = 'before_attribute_name_state';
	} else if(data == '&') {
		this.process_entity_in_attribute(buffer);
	} else if(data == '>') {
		this.emit_current_token();
	} else if(data == '"' || data == "'" || data == '=') {
		this.parse_error("unexpected-character-in-unquoted-attribute-value");
		this.current_token.data.last()[1] += data;
	} else if(data == HTML5.EOF) {
		this.parse_error("eof-in-attribute-value-no-quotes");
		this.emit_current_token();
	} else {
		this.current_token.data.last()[1] += data + buffer.matchUntil(HTML5.SPACE_CHARACTERS + '&<>');
	}
	return true;
}

t.prototype.after_attribute_value_state = function(buffer) {
	var data = buffer.shift(1);
	if(HTML5.SPACE_CHARACTERS_R.test(data)) {
		this.state = 'before_attribute_value_state';
	} else if(data == '>') {
		this.emit_current_token();
		this.state = 'data_state';
	} else if(data == '/') {
		this.state = 'self_closing_tag_state';
	} else if(data == HTML5.EOF) {
		this.parse_error( "unexpected-EOF-after-attribute-value");
		this.emit_current_token();
		buffer.unget(data);
		this.state = 'data_state';
	} else {
		this.emitToken({type: 'ParseError', data: "unexpected-character-after-attribute-value"});
		buffer.unget(data);
		this.state = 'before_attribute_name_state';
	}
	return true;
}

t.prototype.self_closing_tag_state = function(buffer) {
	var c = buffer.shift(1);
	if(c == '>') {
		this.current_token.self_closing = true; 
		this.emit_current_token();
		this.state = 'data_state';
	} else if(c == HTML5.EOF) {
		this.parse_error("eof-in-tag-name");
		buffer.unget(c);
		this.state = 'data_state';
	} else {
		this.parse_error("expected-self-closing-tag");
		buffer.unget(c);
		this.state = 'data_state';
	}
	return true;
}

t.prototype.bogus_comment_state = function(buffer) {
	var tok = {type: 'Comment', data: buffer.matchUntil('>')}
	buffer.shift(1);
	this.emitToken(tok);
	this.state = 'data_state';
	return true;
}

t.prototype.markup_declaration_open_state = function(buffer) {
	var chars = buffer.shift(2);
	if(chars == '--') {
		this.current_token = {type: 'Comment', data: ''};
		this.state = 'comment_start_state';
	} else {
		var newchars = buffer.shift(5);
		if(newchars == HTML5.EOF || chars == HTML5.EOF) {
                        this.parse_error("expected-dashes-or-doctype");
			this.state = 'bogus_comment_state'
			if(chars != HTML5.EOF) buffer.unget(chars);
			return true;
		}

		// Check for EOF better -- FIXME
		chars += newchars;
		if(chars.toUpperCase() == 'DOCTYPE') {
			this.current_token = {type: 'Doctype', name: '', publicId: null, systemId: null, correct: true};
			this.state = 'doctype_state';
		} else {
			this.parse_error("expected-dashes-or-doctype");
			buffer.unget(chars);
			this.state = 'bogus_comment_state';
		}
	}
	return true;
}

t.prototype.comment_start_state = function(buffer) {
	var data = buffer.shift(1);
	HTML5.debug('tokenizer.comment_start_state', data);
	if(data == '-') {
		this.state = 'comment_start_dash_state';
	} else if(data == '>') {
		this.parse_error("incorrect comment");
		this.emitToken(this.current_token);
		this.state = 'data_state';
	} else if(data == HTML5.EOF) {
		this.parse_error("eof-in-comment");
		this.emitToken(this.current_token);
		this.state = 'data_state';
	} else {
		this.current_token.data += data + buffer.matchUntil('-');
		this.state = 'comment_state';
	}
	return true;
}

t.prototype.comment_start_dash_state = function(buffer) {
	var data = buffer.shift(1);
	HTML5.debug('tokenizer.comment_start_dash_state', data);
	if(data == '-') {
		this.state = 'comment_end_state'
	} else if(data == '>') {
		this.parse_error("incorrect-comment");
		this.emitToken(this.current_token);
		this.state = data_state;
	} else if(data == HTML5.EOF) {
		this.parse_error("eof-in-comment");
		this.emitToken(this.current_token);
		this.state = 'data_state';
	} else {
		this.current_token.data += '-' + data + buffer.matchUntil('-');
		this.state = 'comment_state';
	}
	return true;
}

t.prototype.comment_state = function(buffer) {
	var data = buffer.shift(1);
	HTML5.debug('tokenizer.comment_state', data);
	if(data == '-') {
		this.state = 'comment_end_dash_state';
	} else if(data == HTML5.EOF) {
		this.parse_error("eof-in-comment");
		this.emitToken(this.current_token);
		this.state = 'data_state';
	} else {
		this.current_token.data += data + buffer.matchUntil('-');
	}
	return true;
}

t.prototype.comment_end_dash_state = function(buffer) {
	var data = buffer.shift(1);
	HTML5.debug('tokenizer.comment_end_dash_state', data);
	if(data == '-') {
		this.state = 'comment_end_state';
	} else if (data == HTML5.EOF) {
		this.parse_error("eof-in-comment-end-dash");
		this.emitToken(this.current_token);
		this.state = 'data_state';
	} else {
		this.current_token.data += '-' + data + buffer.matchUntil('-');
		// Consume the next character which is either a "-" or an :EOF as
		// well so if there's a "-" directly after the "-" we go nicely to
		// the "comment end state" without emitting a ParseError there.
		buffer.shift(1);
	}
	return true;
}

t.prototype.comment_end_state = function(buffer) {
	var data = buffer.shift(1);
	HTML5.debug('tokenizer.comment_end_state', data)
	if(data == '>') {
		this.emitToken(this.current_token);
		this.state = 'data_state';
	} else if(data == '-') {
		this.parse_error("unexpected-dash-after-double-dash-in-comment");
		this.current_token.data += data;
	} else if (data == HTML5.EOF) {
		this.parse_error("eof-in-comment-double-dash");
		this.emitToken(this.current_token);
		this.state = 'data_state';
	} else {
		// XXX
		this.parse_error("unexpected-char-in-comment");
		this.current_token.data += '--' + data;
		this.state = 'comment_state';
	}
	return true;
}

t.prototype.doctype_state = function(buffer) {
	var data = buffer.shift(1);
	if(HTML5.SPACE_CHARACTERS_R.test(data)) {
		this.state = 'before_doctype_name_state';
	} else {
		this.parse_error("need-space-after-doctype");
		buffer.unget(data);
		this.state = 'before_doctype_name_state';
	}
	return true;
}

t.prototype.before_doctype_name_state = function(buffer) {
	var data = buffer.shift(1);
	if(HTML5.SPACE_CHARACTERS_R.test(data)) {
	} else if(data == '>') {
		this.parse_error("expected-doctype-name-but-got-right-bracket");
		this.current_token.correct = false;
		this.emit_current_token();
		this.state = 'data_state';
	} else if(data == HTML5.EOF) {
		this.parse_error("expected-doctype-name-but-got-eof");
		this.current_token.correct = false;
		this.emit_current_token();
		this.state = 'data_state';
	} else {
		this.current_token.name = data;
		this.state = 'doctype_name_state';
	}
}

t.prototype.doctype_name_state = function(buffer) {
	var data = buffer.shift(1);
	if(HTML5.SPACE_CHARACTERS_R.test(data)) {
	} else if(data == '>') {
		this.emit_current_token();
		this.state = 'data_state';
	} else if(data == HTML5.EOF) {
		this.current_token.correct = false;
		buffer.unget(data);
		this.parse_error("eof-in-doctype");
		this.emit_current_token();
		this.state = 'data_state';
	} else {
		this.current_token.name += data;
	}
}
/*
		data += buffer.shift(5);
		var token = data.toLowerCase();
		if(token == 'public') {
			this.state = 'before_doctype_public_identifier_state';
		} else if(token == 'system') {
			this.state = 'before_doctype_system_identifier_state';
		} else {
			buffer.unget(data);
			this.parse_error("expected-space-or-right-bracket-in-doctype", {data: data});
			this.state = 'bogus_doctype_state';
		}
	}
}
*/

t.prototype.bogus_doctype_state = function(buffer) {
	var data = buffer.shift(1);
	this.current_token.correct = false;
	if(data == '>') {
		this.emit_current_token();
		this.state = 'data_state';
	} else if(data == HTML5.EOF) {
		throw(new Error("Unimplemented!"))
	}
}

t.prototype.parse_error = function(message) {
	this.emitToken({type: 'ParseError', data: message});
}

t.prototype.emit_current_token = function() {
	var tok = this.current_token;
	switch(tok.type) {
	case 'StartTag':
	case 'EndTag':
	case 'EmptyTag':
		if(tok.type == 'EndTag' && tok.self_closing) {
			this.parse_error('self-closing-end-tag');
		}
		break;
	}
	this.emitToken(tok);
	this.state = 'data_state';
}
