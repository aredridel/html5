var vows = require('vows')
var assert = require('assert')
var HTML5 = require('../lib/html5')

vows.describe('serializer').addBatch({
	'Test Serializer': {
		topic: function() {
			var p = new HTML5.Parser()
			p.parse('<p class="Hello">Hi!</p><p class="hello there">Hi again</p>')
			this.callback(null, p)
		},
		'should serialize properly': function(p) {
			assert.equal(HTML5.serialize(p.tree.document, null, {lowercase: true}), '<html><head></head><body><p class="Hello">Hi!</p><p class="hello there">Hi again</p></body></html>');
		}
	}
}).export(module)
