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
