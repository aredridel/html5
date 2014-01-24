#!/usr/bin/env node
"use strict";
var JSDOMParser = require('../../lib/jsdom/JSDOMParser').JSDOMParser,
	events = require('events'),
	fs = require('fs'),
	test = require('tape'),
	serialize = require('../lib/serializeTestOutput').serializeTestOutput,
	jsdom = require('jsdom');

var core = jsdom.browserAugmentation(jsdom.dom.level3.core);
var domImplementation = new core.DOMImplementation();
var base = __dirname + '/../../data/tree-construction/';
var testList = fs.readdirSync(base);

function doTest(testName) {
	test(testName, function (t) {
		var todo = false;
		var testData = {};
		try {
			testData = JSON.parse(fs.readFileSync(testName+'/info.json'));
		} catch(e) {
			if (e.code !== 'ENOENT') throw e;
		}

		try {
			todo = JSON.parse(fs.readFileSync(testName + '/todo.json'));
		} catch (e) {
			if (e.code !== 'ENOENT') throw e;
		}

		var input = fs.readFileSync(testName+'/input.html', 'utf-8');
		var document = fs.readFileSync(testName+'/result.tree', 'utf-8');

		try {
			var doc  = domImplementation.createDocument(null, null, null);
			var p = new JSDOMParser(doc, core);
			p.scriptingEnabled = true;
			p.errorHandler = {error: function(){}}
			if (testData['document-fragment']) {
				var fragment = doc.createDocumentFragment();
				var context = doc.createElement(testData['document-fragment'].trimRight());
				p.parseFragment(input.slice(0, input.length - 1), fragment, context);
				var serialized = serialize(fragment);
			} else {
				p.parse(input.slice(0, input.length - 1));
				var serialized = serialize(doc);
			}
			t.equal(serialized, document, "Document '"+testName+"' matches example data" + (todo ? " #TODO There are still edge cases that need help!" : ""))
		} catch (e) {
			t.fail(e.message + " in document '" + testName + "'" + (todo ? " #TODO There are still edge cases that need help!" : ""))
		}
		t.end()
	})
}

for (var i in testList) {
	var testname = testList[i];
	if (fs.statSync(base+testname).isDirectory() && fs.statSync(base+testname+'/input.html')) {
		doTest(base+testname);
	}
}
