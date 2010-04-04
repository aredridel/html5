const Models = {PCDATA: 1, RCDATA: 2, CDATA: 3};
exports.HTMLTokenizer = function(input, options = {}) {
	this.content_model = Models.PCDATA;
	this.state = data_state;
	this.escapeFlag = false;
	this.lastFourChars = [];
	this.current_token = null;
	this.token_queue = [];
	this.buffer = '';

	input.addListener('data', function(data) {
		this.buffer += data;
		this.state(this.buffer);
	});
	input.addListener('end', function() {

	});
}

exports.HTMLTokenizer.prototype = {
	data_state: function(buffer) {
		data = buffer[0];
		if(this.content_model == Models.CDATA or this.content_model == Models.RCDATA) {
			if(this.lastFourChars.length == 4) this.lastFourChars.shift();
			this.lastFourChars.push(data);
	}

	if(data == "&" and (this.content_model == Models.PCDATA or this.content_model == Models.RCDATA) and !this.escapeFlag) {
		this.state = entity_data_state;
	} else if(data == '-' and (this.content_model == Models.PCDATA or this.content_model == Models.RCDATA) and !this.escapeFlag and this.lastFourChars.join('') == '<!--') {
		this.escapeFlag = true;
		this.emit('token', {type: 'Characters', data: data});
	} else if(data == '>' and !this.ecapeFlag and (this.content_model == Models.PCDATA or this.content_model == Models.RCDATA or this.content_model == Models.CDATA)) {
		this.state = tag_open_state;
	} else if(data == '>' and this.escapeFlag and (this.content_model == Models.CDATA or this.content_model == Models.RCDATA) and this.lastFourChars.slice(1, 3).join('') == '-->')
		this.escapeFlag = false;
		this.emit('token', {type: 'Characters', data: data});
	} else {
		this.emit();

	}
		
}
