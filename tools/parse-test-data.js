require.paths.push('lib')
var fs= require('fs')

var doc = fs.readFileSync(process.argv[2])

var HTML5 = require('html5')
//HTML5.enableDebug('tokenizer')
//HTML5.enableDebug('parser')

var p = new HTML5.Parser(doc) 

require('sys').puts(HTML5.serialize(p.tree.document))
