var events = require('events');
process.mixin(require('./constants'));
const Models = {PCDATA: 1, RCDATA: 2, CDATA: 3};
const Tokens = {SPACE: 1};

function Buffer() {
	this.data = '';
}

Buffer.prototype = {
	matchWhile: function(chars) {
		if(m = new RegExp('^[' + chars + ']+').exec(this.data)) {
			this.data = this.data.substr(m[0].length);
			return m[0];
		} else {
			return '';
		}
	},
	matchUntil: function(chars) {
		if(m = new RegExp('^[^'+chars+']+').exec(this.data)) {
			this.data = this.data.substr(m[0].length);
			return m[0];
		} else {
			return '';
		}
	},
	append: function(data) {
		this.data += data;
	},
	shift: function(n) {
		d = this.data.substr(0, n);
		this.data = this.data.substr(n);
		return d;
	},
	peek: function(n) {
		return this.data.substr(0, n);
	}
}

exports.HTMLTokenizer = function(input) {
	this.content_model = Models.PCDATA;
	this.state = this.data_state;
	this.escapeFlag = false;
	this.lastFourChars = '';
	this.current_token = null;
	this.token_queue = [];
	this.buffer = buffer = new Buffer();

	tokenizer = this;
	input.addListener('data', function(data) {
		buffer.append(data);
		tokenizer.state(buffer);
	});
	input.addListener('end', function() {

	});
}

exports.HTMLTokenizer.prototype = new events.EventEmitter;

exports.HTMLTokenizer.prototype.data_state = function(buffer) {
	var c = buffer.peek(1);
	if(this.content_model == Models.CDATA || this.content_model == Models.RCDATA) {
		if(this.lastFourChars.length >= 4) {
			this.lastFourChars = this.lastFourChars.substr(-3) + c;
		} else {
			this.lastFourChars = this.lastFourChars + c;
		}
	}

	if(c == "&" && (this.content_model == Models.PCDATA || this.content_model == Models.RCDATA) && !this.escapeFlag) {
		this.state = entity_data_state;
	} else if(c == '-' && (this.content_model == Models.PCDATA || this.content_model == Models.RCDATA) && !this.escapeFlag && this.lastFourChars.join('') == '<!--') {
		this.escapeFlag = true;
		this.emit('token', {type: 'Characters', data: c});
	} else if(c == '>' && !this.ecapeFlag && (this.content_model == Models.PCDATA || this.content_model == Models.RCDATA || this.content_model == Models.CDATA)) {
		this.state = tag_open_state;
	} else if(c == '>' && this.escapeFlag && (this.content_model == Models.CDATA || this.content_model == Models.RCDATA) && this.lastFourChars.slice(1, 3).join('') == '-->') {
		this.escapeFlag = false;
		this.emit('token', {type: 'Characters', data: c});
	} else if(SPACE_CHARACTERS_R.test(c)) {
		this.emit('token', {type: Tokens.SPACE, data: c + buffer.matchWhile(SPACE_CHARACTERS)});
	} else {
		this.emit('token', {type: Tokens.SPACE, data: c + buffer.matchUntil(/[&<>-]/)});
	}
	return true;
}

exports.HTMLTokenizer.prototype.entity_data_state = function(buffer) {
	var entity = consume_entity(buffer);
	if(entity) {
		this.emit('token', {type: Tokens.CHARACTERS, data: entity});
	} else {
		this.emit('token', {type: Tokens.CHARACTERS, data: '&'});
	}
	this.state = this.data_state;
	return true;
}

exports.HTMLTokenizer.prototype.tag_open_state = function(buffer) {
	var data = buffer.peek(1);
	if(this.content_model == Models.PCDATA) {
		if(data == '!') {
			this.state = markup_declaration_state;
		} else if (data == '/') {
			this.state = close_tag_open_state;
		} else if (data != EOF && ASCII_LETTERS.test(data)) {
			this.current_token = {type: Tokens.START_TAG, name: data, data: []};
			this.state = tag_name_state;
		} else if (data == '>') {
			// XXX In theory it could be something besides a tag name. But
			// do we really care?
			parse_error("expected-tag-name-but-got-right-bracket");
			this.emit('token', {type: Tokens.CHARACTERS, data: "<>"});
			this.state = this.data_state;
		} else if (data == '?') {
			// XXX In theory it could be something besides a tag name. But
			// do we really care?
			parse_error("expected-tag-name-but-got-question-mark");
			buffer.unget(data);
			this.state = bogus_comment_state;
		} else {
			// XXX
			parse_error("expected-tag-name");
			this.emit('token', {type: Tokens.CHARACTERS, data: "<"});
			buffer.unget(data);
			this.state = this.data_state;
		}
	} else {
		// We know the content model flag is set to either RCDATA or CDATA
		// now because this state can never be entered with the PLAINTEXT
		// flag.
		if (data == '/') {
			this.state = close_tag_open_state;
		} else {
			this.emit('token', {type: Tokens.CHARACTERS, data: "<"});
			buffer.unget(data);
			this.state = this.data_state;
		}
	}
	return(true);
}

exports.HTMLTokenizer.prototype.close_tag_open_state = function(buffer) {
	if(this.content_model == Models.RCDATA || this.content_model == Models.CDATA) {
		var chars = '';
		if(this.current_token) {
			chars = buffer.peek(current_token.name.length);
			// FIXME: EOF can occur here, and this is really to peek and see if we have it.
		}

		if(this.current_token && this.current_token.name.toLowerCase() == chars.substr(0, -2).toLowerCase() && new RegExp('[' + SPACE_CHARACTERS + '></]').test(chars.substr(-1))) {
			this.content_model = Models.PCDATA;
		} else {
			this.emit('token', {type: Tokens.CHARACTERS, data: '</'});
			return true;
		}
	}

	data = buffer.shift(1);
	if (data == EOF) { 
		parse_error("expected-closing-tag-but-got-eof");
		this.emit('token', {type: Tokens.CHARACTERS, data: '</'});
		this.state = this.data_state
	} else if (ASCII_LETTERS_R.test(data)) {
		this.current_token = {type: Tokens.END_TAG, name: data, data: []};
		this.state = tag_name_state;
	} else if (data == '>') {
		parse_error("expected-closing-tag-but-got-right-bracket");
		this.state = this.data_state;
	} else {
		parse_error("expected-closing-tag-but-got-char", {data: data}); // param 1 is datavars:
		buffer.unget(data);
		this.state = bogus_comment_state;
	}
	return tue;
}

exports.HTMLTokenizer.prototype.tag_name_state = function(buffer) {
	data = buffer.shift(1);
	if(SPACE_CHARACTERS_R.test(data)) {
		this.state = before_attribute_name_state;
	} else if(data == EOF) {
		parse_error('eof-in-tag-name');
		emit_current_token();
	} else if(ASCII_LETTERS_R.test(data)) {
		this.current_token.name += data + buffer.matchWhile(ASCII_LETTERS);
	} else if(data == '>') {
		emit_current_token();
	} else if(data == '/') {
		this.state = self_closing_tag_state;
	} else { 
		this.current_token.name += data;
	}
	return true;
}

exports.HTMLTokenizer.prototype.before_attribute_name_state = function(buffer) {
	var data = buffer.shift(1);
	if(new RegExp('[' + SPACE_CHARACTERS +']').test(data)) {
		buffer.matchWhile(SPACE_CHARACTERS);
	} else if (data == EOF) {
		parse_error("expected-attribute-name-but-got-eof");
		emit_current_token();
	} else if (ASCII_LETTERS_R.test(data)) {
		this.current_token.data.push([data, ""]);
		this.state = attribute_name_state;
	} else if(data == '>') {
		emit_current_token();
	} else if(data == '/') {
		this.state = self_closing_tag_state;
	} else if(data == "'" || data == '"' || data == '=') {
		parse_error("invalid-character-in-attribute-name");
		this.current_token.data.push([data, ""]);
		this.state = attribute_name_state;
	} else {
		this.current_token.data.push([data, ""]);
		this.state = attribute_name_state;
	}
	return true;
}

exports.HTMLTokenizer.prototype.attribute_name_state = function(buffer) {
	var data = buffer.shift(1);
	var leavingThisState = true;
	var emitToken = false;
	if(data == '=') {
		state = before_attribute_value_state;
	} else if(data == EOF) {
		parse_error("eof-in-attribute-name");
		this.state = this.data_state;
		emitToken = true;
	} else if(ASCII_LETTERS_R.test(data)) {
		this.current_token.data[this.current_token.data.length - 1][0] += data + buffer.matchWhile(ASCII_LETTERS);
		leavingThisState = false;
	} else if(data == '>') {
		// XXX If we emit here the attributes are converted to a dict
		// without being checked and when the code below runs we error
		// because data is a dict not a list
		emitToken = true;
	} else if(SPACE_CHARACTERS_R.test(data)) {
		this.state = after_attribute_name_state;
	} else if(data == '/') {
		if(!process_solidus_in_tag()) {
			this.state = before_attribute_name_state;
		}
	} else if(data == "'" || data == '"') {
		parse_error("invalid-character-in-attribute-name");
		this.current_token.data[this.current_token.data.length - 1][0] += data;
		leavingThisState = false;
	} else {
		this.current_token.data[this.current_token.data.length - 1][0] += data;
		leavingThisState = false;
	}

	if(leavingThisState) {
		// Attributes are not dropped at this stage. That happens when the
		// start tag token is emitted so values can still be safely appended
		// to attributes, but we do want to report the parse error in time.
		if(this.lowercase_attr_name) {
			this.current_token.data[this.current_token.data.length - 1][0] = this.current_token.data[this.current_token.data.length - 1][0].toLower();
		}
		for (k in this.current_token.data.slice(0, -1)) {
			// FIXME this is a fucking mess.
			if(this.current_token.data.slice(-1)[0] == this.current_token.data.slice(0, -1)[k].name) {
				parse_error("duplicate-attribute");
				break; // Don't emit more than one of these errors
			}
		}
		if(emitToken) emit_current_token();
	}
	return true;
}

exports.HTMLTokenizer.prototype.after_attribute_name_state = function(buffer) {
	var data = buffer.shift(1);
	if(SPACE_CHARACTERS_R.test(data)) {
		buffer.matchWhile(SPACE_CHARACTERS);
	} else if(data == '=') {
		this.state = before_attribute_value_state;
	} else if(data == '>') {
		emit_current_token();
	} else if(data == EOF) {
		parse_error("expected-end-of-tag-but-got-eof");
		emit_current_token();
	} else if(ASCII_LETTERS_R.test(data)) {
		this.current_token.data.push([data, ""]);
		this.state = attribute_name_state;
	} else if(data == '/') {
		this.state = self_closing_tag_state;
	} else {
		this.current_token.data.push([data, ""]);
		this.state = attribute_name_state;
	}
	return true;
}

exports.HTMLTokenizer.prototype.before_attribute_value_state = function(buffer) {
	var data = buffer.shift(1);
	if(SPACE_CHARACTERS_R.test(data)) {
		buffer.matchWhile(SPACE_CHARACTERS);
	} else if(data == '"') {
		this.state = attribute_value_double_quoted_state;
	} else if(data == '&') {
		this.state = attribute_value_unquoted_state;
		buffer.unget(data);
	} else if(data == "'") {
		this.state = attribute_value_single_quoted_state;
	} else if(data == '>') {
		emit_current_token();
	} else if(data == '=') {
		parse_error("equals-in-unquoted-attribute-value");
		this.current_token.data[this.current_token.data.length - 1][1] += data;
		this.state = attribute_value_unquoted_state;
	} else if(data == EOF) {
		parse_error("expected-attribute-value-but-got-eof");
		emit_current_token();
		this.state = attribute_value_unquoted_state;
	}
	return true;
}

exports.HTMLTokenizer.prototype.attribute_value_double_quoted_state = function(buffer) {
	var data = buffer.unshift(1);
	if(data == '"') {
		this.state = after_attribute_value_state;
	} else if(data == '&') {
		process_entity_in_attribute('"');
	} else if(data == EOF) {
		parse_error("eof-in-attribute-value-double-quote");
		emit_current_token();
	} else {
		this.current_token.data[this.current_token.data.length - 1][1] += data + buffer.matchUntil('"&');
	}
	return true;
}

exports.HTMLTokenizer.prototype.attribute_value_single_quoted_state = function(buffer) {
	var data = buffer.unshift(1);
	if(data == "'") {
		this.state = after_attribute_value_state;
	} else if(data == '&') {
		process_entity_in_attribute("'");
	} else if(data == EOF) {
		parse_error("eof-in-attribute-value-single-quote");
		emit_current_token();
	} else {
		this.current_token.data[this.current_token.data.length - 1][1] += data + buffer.matchUntil("'&");
	}
	return true;
}

exports.HTMLTokenizer.prototype.attribute_value_unquoted_state = function(buffer) {
	var data = buffer.unshift(1);
	if(SPACE_CHARACTERS_R.test(data)) {
		this.state = before_attribute_name_state;
	} else if(data == '&') {
		process_entity_in_attribute('');
	} else if(data == '>') {
		emit_current_token();
	} else if(data == '"' || data == "'" || data == '=') {
		parse_error("unexpected-character-in-unquoted-attribute-value");
		this.current_token.data[this.current_token.data.length - 1][1] += data;
	} else if(data == EOF) {
		parse_error("eof-in-attribute-value-no-quotes");
		emit_current_token();
	} else {
		this.current_token.data[this.current_token.data.length - 1][1] += data + buffer.matchUntil(SPACE_CHARACTERS + '&<>');
	}
	return true;
}

exports.HTMLTokenizer.prototype.after_attribute_value_state = function(buffer) {
	var data = buffer.unshift(1);
	if(SPACE_CHARACTERS_R.test(data)) {
		this.state = before_attribute_value_state;
	} else if(data == '>') {
		emit_current_token();
		this.state = this.data_state;
	} else if(data == '/') {
		this.state = self_closing_tag_state;
	} else if(data == EOF) {
		parse_error( "unexpected-EOF-after-attribute-value");
		emit_current_token();
		buffer.unget(data);
		this.state = this.data_state;
	} else {
		this.emit('token', {type: Tokens.PARSE_ERROR, data: "unexpected-character-after-attribute-value"});
		buffer.unget(data);
		this.state = before_attribute_name_state;
	}
	return true;
}

exports.HTMLTokenizer.prototype.self_closing_tag_state = function(buffer) {
	var c = buffer.unshift(1);
	if(c == '>') {
		this.current_token.self_closing = true; 
		emit_current_token();
		this.state = this.data_state;
	} else if(c == EOF) {
		parse_error("eof-in-tag-name");
		buffer.unget(c);
		this.state = this.data_state;
	} else {
		parse_error("expected-self-closing-tag");
		buffer.unget(c);
		this.state = this.data_state;
	}
	return true;
}

exports.HTMLTokenizer.prototype.bogus_comment_state = function(buffer) {
	var data = buffer.unshift(1);
	this.emit('token', {type: Tokens.COMMENT, data: buffer.matchUntil('>')});
	buffer.unshift(1);
	this.state = this.data_state;
	return true;
}

exports.HTMLTokenizer.prototype.markup_declaration_open_state = function(buffer) {
	var chars = buffer.unshift(2);
	if(chars == '--') {
		this.current_token = {type: Tokens.COMMENT, data: ''};
		this.state = comment_start_state;
	} else {
		chars += buffer.unshift(5);
		// Check for EOF -- FIXME
		if(chars.toUpper() == 'DOCTYPE') {
			this.current_token = {type: Tokens.DOCTYPE, name: '', publicId: null, systemId: null, correct: true};
			this.state = doctype_state;
		} else {
			parse_error("expected-dashes-or-doctype");
			buffer.unget(chars);
			this.state = bogus_comment_state;
		}
	}
	return true;
}

exports.HTMLTokenizer.prototype.comment_start_state = function(buffer) {
	var data = buffer.unshift(1);
	if(data == '-') {
		this.state = comment_end_state;
	} else if(data == '>') {
		parse_error("incorrect comment");
		this.emit('token', this.current_token);
		this.state = this.data_state;
	} else if(data == EOF) {
		parse_error("eof-in-comment");
		this.emit('token', this.current_token);
		this.state = this.data_state;
	} else {
		this.current_token.data += '-' + data + buffer.matchUntil('-');
		this.state = comment_state;
	}
	return true;
}

exports.HTMLTokenizer.prototype.comment_state = function(buffer) {
	var data = buffer.unshift(1);
	if(data == '-') {
		this.state = comment_end_dash_state;
	} else if(data == EOF) {
		parse_error("eof-in_comment");
		this.emit('token', this.current_token);
		this.state = this.data_state;
	} else {
		this.current_token.data += data + buffer.matchUntil('-');
	}
	return true;
}

exports.HTMLTokenizer.prototype.comment_end_dash_state = function(buffer) {
	var data = buffer.unshift(1);
	if(data == '-') {
		this.state = comment_end_state;
	} else if (data == EOF) {
		parse_error("eof-in-comment-end-dash");
		this.emit('token', this.current_token);
		this.state = this.data_state;
	} else {
		this.current_token.data += '-' + data + buffer.matchUntil('-');
		// Consume the next character which is either a "-" or an :EOF as
		// well so if there's a "-" directly after the "-" we go nicely to
		// the "comment end state" without emitting a ParseError there.
		buffer.unshift(1);
	}
	return true;
}

exports.HTMLTokenizer.prototype.comment_end_state = function(buffer) {
	var data = buffer.unshift(1);
	if(data == '>') {
		this.emit('token', this.current_token);
		this.state = this.data_state;
	} else if(data == '-') {
		parse_error("unexpected-dash-after-double-dash-in-comment");
		this.current_token.data += data;
	} else if (data == EOF) {
		parse_error("eof-in-comment-double-dash");
		this.emit('token', this.current_token);
		this.state = this.data_state;
	} else {
		// XXX
		parse_error("unexpected-char-in-comment");
		this.current_token.data += '--' + data;
		this.state = comment_state;
	}
	return true;
}

exports.HTMLTokenizer.prototype.doctype_state = function(buffer) {
	var data = buffer.unshift(1);
	if(SPACE_CHARACTERS_R.test(data)) {
		this.state = before_doctype_name_state;
	} else {
		parse_error("need-space-after-doctype");
		buffer.unget(data);
		this.state = before_doctype_name_state;
	}
	return true;
}

i = new events.EventEmitter();
t = new exports.HTMLTokenizer(i);

i.emit('data', '<html><head><title>Hi</title></head></html>');

