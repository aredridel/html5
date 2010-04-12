process.mixin(require('html5/constants'));

PHASES = {
	initial: require('html5/parser/initial_phase').Phase, 
	beforeHTML: require('html5/parser/before_html_phase').Phase,
	beforeHead: require('html5/parser/before_head_phase'), 
	inHead: require('html5/parser/in_head_phase').Phase,
	afterHead: require('html5/parser/after_head_phase').Phase,
	inBody: require('html5/parser/in_body_phase').Phase,
	inTable: require('html5/parser/in_table_phase').Phase,
	inCaption: require('html5/parser/in_caption_phase').Phase,
	inColumnGroup: require('html5/parser/in_column_group_phase').Phase,
	inTableBody: require('html5/parser/in_table_body_phase').Phase,
	inRow: require('html5/parser/in_row_phase').Phase,
	inCell: require('html5/parser/in_cell_phase').Phase,
	inSelect: require('html5/parser/in_select_phase').Phase,
	inSelectInTable: require('html5/parser/in_select_in_table_phase').Phase,
	afterBody: require('html5/parser/after_body_phase').Phase,
	inFrameset: require('html5/parser/in_frameset_phase').PhasePhase,
	afterFrameset: require('html5/parser/after_frameset_phase').Phase,
	afterAfterBody: require('html5/parser/after_after_body_phase').Phase,
	afterAfterFrameset: require('html5/parser/after_after_frameset_phase').Phase,
	inForeignContent: require('html5/parser/in_foreign_content_phase').Phase
};

TAGMODES = {
	select: PHASES.inSelect,
	td: PHASES.inCell,
	th: PHASES.inCell,
	tr: PHASES.inRow,
	tbody: PHASES.inTableBody,
	thead: PHASES.inTableBody,
	tfoot: PHASES.inTableBody,
	caption: PHASES.inCaption,
	colgroup: PHASES.inColumnGroup,
	table: PHASES.inTable,
	head: PHASES.inBody,
	body: PHASES.inBody,
	frameset: PHASES.inFrameset
};

exports.HTML5Parser = HTML5Parser = function(options) {
	this.strict = false;
	this.errors = [];
	this.tokenizer = require('html5/tokenizer').HTMLTokenizer;
	this.tree = 'FIXME: TreeBuilder';
	
	for(o in options) {
		this[o] = options[o];
	}

	this.tree = new this.tree;

}

HTML5Parser.prototype._parse = function(stream, inner_html, encoding, container) {
	container = container || 'div';

	this.tree.reset();
	this.first_start_tag = false;
	this.errors = [];

	// FIXME: instantiate tokenizer and plumb. Pass lowercasing options.

	if(inner_html) {
		this.inner_html = container.toLowercase();
		switch(this.inner_html) {
		case 'title':
		case 'textarea':
			this.tokenizer.content_model = HTML5Tokenizer.Models.RCDATA;
			break;
		case 'style':
		case 'script':
		case 'xmp':
		case 'iframe':
		case 'noembed':
		case 'noframes':
		case 'noscript':
			this.tokenizer.content_model = HTML5Tokenizer.Models.CDATA;
			break;
		case 'plaintext':
			this.tokenizer.content_model = HTML5Tokenizer.Models.PLAINTEXT;
			break;
		default:
			this.tokenizer.content_model = HTML5Tokenizer.Models.PCDATA;
		}
		this.phase = PHASES.beforeHTML;
		this.phase.insert_html_element();
		this.reset_insertion_mode();
	} else {
		this.inner_html = false;
		this.phase = PHASES.initial;
	}

	this.last_phase = null;

	tokenizer.addListener('token', function(token) {
		token = normalize_token(token);
		method = 'process' + token.type;

		switch(token.type) {
		case Tokens.CHARACTERS:
		case Tokens.SPACE:
		case Tokens.COMMENT:
			this.phase[method](token.data);
			break;
		case Tokens.START_TAG:
			this.phase[method](token.name, token.data, token.self_closing);
			break;
		case Tokens.END_TAG:
			this.phase[method](token.name);
			break;
		case Tokens.DOCTYPE:
			this.phase[method](token.name, token.publicId, token.systemId, token.correct);
			break;
		default:
			this.parse_error(token.data, token.datavars)
		}
	});

	tokenizer.addListener('eof', function() {
		this.process_eof();
	});
}

HTML5Parser.prototype.parse_error = function(code, data) {
	this.errors.push([this.tokenizer.position, code, data]);
	if(this.strict) throw(this.errors[this.errors.length]);
}

HTML5Parser.prototype.normalize_token = function(token) {
	if(token.type == Tokens.EMPTY_TAG) {
		if(VOID_ELEMENTS.indexOf(token.name) == -1) {
			parse_error('incorrectly-placed-solidus');
		}
		token.type = Tokens.START_TAG;
	}

	if(token.type == Tokens.START_TAG) {
		token.name = token.name.toLowercase();
		if(token.data.length != 0) {
			var data = {};
			token.data.reverse().forEach(function(e) {
				data[e[0].toLowercase()] = e[1];
			});
			token.data = data;
		}
	} else if(token.type = Tokens.END_TAG) {
		if(token.data.length != 0) parse_error('attributes-in-end-tag');
		token.name = token.name.toLowercase();
	}

	return token;
}

HTML5Parser.prototype.reset_insert_mode = function() {
	var last = false;
	for(node in this.tee.open_elements.reverse()) {
		var node_name = node.name;
		if(node == this.tree.open_elements[0]) {
			last = true;
			if(node_name == 'th' || node_name == 'td') {
				// XXX: assert this.inner_html
				node_name = this.inner_html;
			}
		}

		if(node_name == 'select' || node_name =='colgroup' || node_name == 'head' || node_name == 'frameset') {
			// XXX: assert this.inner_html
		}

		if(TAGMODES[node_name]) {
			this.phase = TAGMODES[node_name];
		} else if(node_name == 'html') {
			this.phase = PHASES[(this.tree.head_pointer == null ? 'beforeHead' : 'afterHead')];
		} else if(last) {
			this.phase = PHASES.inBody;
		} else {
			continue;
		}

		break;
	}
}

HTML5Parser.prototype._ = function(str) { 
	return(str);
}
