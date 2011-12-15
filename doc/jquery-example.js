require.paths.unshift('lib')
require.paths.unshift('deps/jsdom/lib')
var  HTML5 = require('html5'),
    Script = process.binding('evals').Script,
      util = require('util'),
        fs = require('fs'),
     jsdom = require('jsdom'),
    window = jsdom.createWindow(null, null, {parser: HTML5, document: new jsdom.dom.level1.core.Document()});

window.document.removeChild(window.document.childNodes[0]); // Clear the stub document that jsdom gives us

var parser = new HTML5.Parser({document: window.document});

var inputfile = fs.readFileSync('doc/jquery-example.html');
parser.parse(inputfile);

jsdom.jQueryify(window, 'deps/jquery/dist/jquery.js', function(window, jquery) {
	Script.runInNewContext('jQuery("p").append("<b>Hi!</b>")', window);
	sys.puts(window.document.innerHTML);

});
