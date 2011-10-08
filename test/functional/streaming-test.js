var HTML5 = require('../lib/html5'),
	events = require('events'),
	vows = require('vows'),
	assert = require('assert'),
	serialize = require('./support/serializeTestOutput').serializeTestOutput;

var suite = vows.describe('streaming')

suite.addBatch({
	'Streamed data': {
		topic: function() {
			var topic = this
			var em = new events.EventEmitter();
			p = new HTML5.Parser();
			p.on('end', function() { topic.callback(null, p) })
			p.parse(em);
			em.emit('data', '<p>This is a');
			em.emit('data', ' test of the <e');
			em.emit('data', 'm>emergency</em> broadcast system');
			em.emit('end');
		},
		'should parse correctly': function(p) {
			assert.equal(serialize(p.document), '<html>\n  <head>\n  <body>\n    <p>\n      "This is a test of the "\n      <em>\n        "emergency"\n      " broadcast system"\n')
		}
	}
}).export(module)
