HTML5 Parser for node.js
========================


Example (With jQuery!) 
----------------------

        /* Before you run this, run:
              git submodule update --init
              (cd deps/jquery; rake)
        */
        var  HTML5 = require('html5'),
            Script = process.binding('evals').Script,
               sys = require('sys'),
                fs = require('fs'),
             jsdom = require('jsdom'),
            window = jsdom.jsdom(null, null, {parser: HTML5}).createWindow()

        var parser = new HTML5.Parser({document: window.document});

        var inputfile = fs.readFileSync('doc/jquery-example.html');
        parser.parse(inputfile);

        jsdom.jQueryify(window, __dirname + '/deps/jquery/dist/jquery.js', function(window, jquery) {
                Script.runInNewContext('jQuery("p").append("<b>Hi!</b>")', window);
                sys.puts(window.document.innerHTML);

        });
Interesting features
--------------------

* Streaming parser: You can pass `parser.parse` an `EventEmitter` and the
  parser will keep adding data as it's received.

* HTML5 parsing algorithm. If you find something this can't parse, I'll want
  to know about it. It should make sense out of anything a browser can.

Installation
-------------

Use `npm`, or to use the git checkout, read on.

You'll need to initialize git submodules if you're pulling this from my git
repository. 

	git submodules init

To give it a test, set up your environment, including the directory containing the built dom.js from jsdom:

	export NODE_PATH=lib:deps/jsdom/lib

Or copy the contents of the jsdom lib directory to ~/.node_libraries/

and give it a run:

	node test.js

Git repository at http://theinternetco.net/~aredridel/projects/js/html5/.git/
