v1.0.3
=============

* v1.0.3
* Fix SAX fragment parsing.

v1.0.2
=============

* v1.0.2
* Fix jsdom versioning shenanigan

v1.0.1
=============

* v1.0.1
* Use the right version of jsdom, not so loose with versioning
* Simplify package.json
* Fix README example

v1.0.0
=============

* v1.0.0
* Add badge
* Drop testing node 0.8 thanks to pointy versions in package.json
* Start testing under node 0.11
* Make tree construction test use new jsdom API
* Fix duplicate devDependencies section; use pointy versions
* Fix ronn dependency
* Merge pull request #108 from fb55/patch-1
* replaced `IllegalArgumentException` with `Error`
* Pass error code to error handler.
* Merge pull request #107 from coderaiser/patch-2
* add syntax highlighting

v0.4.1
=============

* Add a new index module and fix main entry point in package.json; v0.4.1

v0.4.0
=============

* Merge dev branch; v0.4.0
* Remove node 0.6 from test builds.
* Always pass attributes (even empty) to sax startElement event
* Add locators to SAX parser.
* Add "unexpected implied end tag (p)" message for fake end p tags.
* Add dirty fix for \r\n handling
* Fix char ref 0x10FFFF codepoint handling
* Init JSDOMTreeBuilder.scriptingEnabled flag (set "true")
* Fix attr namespace decorator in test serializer
* Drop "command" tag support
* Add more jsDoc for ElementStack
* Fix second <html> tag handling
* Remove obsolete test files
* Update test scripts to work with undivided test data files
* Merge pull request #104 from aredridel/tests-as-subtree-merge
* Add test data in original form
* Fix empty attributes (use empty array, not object)
* Fix character handing in after[After]Body modes
* Fix attribute merging in SAXTreeBuilder
* Fix message mistypes.
* Remove streaming-test temporary
* Actually rename files (CamelCase.js)
* Use jsdom object constructors insead of public DOM factory methods
* Fix serializing for test
* Handle UTF-16 characters in EntityParser
* Emit Characters instead of SpaceCharacters, refactor TreeBuilder
* Set foreign attribute prefix
* Performance improvement of ElementStack.inScope()
* Fix syntax error in package.json
* corrected repository information in package.json. It should be singular
* Make jsdom an optional dependency.
* Big refactoring
* Fix #31: remove sites directory.
* Add missing untracked files
* Move encodings from constants to json file
* Move EOF to Buffer, do not pass document to Tokenizer
* Merge pull request #25 from revite/master
* Update tests that involve <frame> in <template> to match specified behaviour.
* Add README files to tokenizer/tree-construction directories.
* Merge pull request #24 from nolanw/select-parse-errors
* Add parse errors for some <template> tests.
* Merge pull request #22 from rafaelw/master
* Merge pull request #23 from Hixie/master
* Add a test for <main> in foreign lands.
* Add tree-construction tests encountering <template> in "in select in table", "after body" and "after head"
* Add test for https://github.com/html5lib/html5lib-python/issues/4
* Use require for modules
* Correct number of parse errors.
* Put parse error token in correct location.
* <command> element no longer exists.
* Move error messages to JSON file
* Merge pull request #17 from nolanw/add-double-escape
* Merge pull request #16 from nolanw/update-parse-errors
* Update tree-construction tests9, tests10.
* Double-escape tokenizer test.
* Update parse errors for tree construction tests.
* Readd license file, add authors file
* Overlong entity name in an attribute is not a parse error.
* Non-alphanumeric bogus character reference isn't a parse error.
* Opposite quote after ampersand in attribute value is not a parse error.
* Nameless entity isn't a parse error.
* A non-ASCII character reference name isn't a parse error.
* Semicolon-free named entities aren't always parse errors.
* DOCTYPE defaults to null name, not empty name.
* Fix #2: JSON has Unicode strings so a leading U+FEFF is not a BOM.
* fixed foster parenting bug
* removed newline, added additional tests
* updated serialization for template.content, added more tests
* news tests for HTMLTemplateElement
* Fix expectation (missing whitespace)
* Add a test for a comment before the head.
* And tree construction tests for the <main> element.
* Test that optgroup is not special.
* Test additional right square brackets before CDATA section end.
* The divs should be nested in the a, oops
* test AAA outer loop limit, inner loop limit, and Noah's Ark limit
* Fix handling of <font> in SVG
* renaming domjs.dat tests to domjs-unsafe.dat because they include binary characters
* add more tests for better code coverage of my JS parser implementation
* tokenizer and tree-builder tests that check correct handling of carriage return in bogus-comment-state and in CDATA sections
* Test <td> breaking out of <svg>.
* Fix accidential conflict
* Fix innerHTML <html> test
* Too many newlines
* Test setting innerHTML of html element to the empty string
* Text in MathML integration points will now reconstruct AFEs
* Move tests containing nulls to correct file
* Test null handling in MathML integration points
* Fix incorrect test
* Remove trailing newline
* Remove bogus content from tests file
* More tests
* Update python code and tests for the recent ruby start tag parsing changes
* Add tests for moving from end tag state to data state without emitting a tag
* Fix ark.dat
* Add test for <!/foo>. Add a newline to the end of a ark.dat.
* Add tests for text in MathML text integration point and U+0000 in an HTML integration point.
* Test reconstruction of active formatting elements in an HTML integration point.
* Change a test to comply with the documented test format.
* Add a newline to the end of tests26.dat.
* Use right class when cloning nodes in lxml, fix issue 178
* Add test for scripted change in Noah's Ark
* Merge test changes
* Move a test the depends on http://www.w3.org/Bugs/Public/show_bug.cgi?id=11393 being unfixed and change the test to expect the spec bug to get fixed.
* Tests for decimal character references followed by hex entities
* Moar tests from WebKit
* Add test for http://www.w3.org/Bugs/Public/show_bug.cgi?id=11393
* Tests for Mozilla bug 635085 - Reconstruct active formatting elements after autoclosing a <nobr> when one was open when seeing another <nobr>. r=hsivonen.
* Add more tests for line break swallowing right after <pre>.
* Change the format of attributes within the treebuilder to be a list of dicts with "namespace", "name", and "value". Moving towards foreign content support in the serializer…
* Add basefont, bgsound and frame to void element test.
* Test all void elements.
* Update encoding tests to spec.
* Add test for reconstructing afe in <plaintext>
* Add LF to the end of plain-text-unsafe files.
* Remove duplicate #document sections from annotation-xml tests.
* Test that SVG <title> and <desc> are scoping.
* mi, mo, ms, mn and mtext are now scoping; fix tests that expected a doctype to materialize out of nowhere.
* Update named entities
* Select changes with added correctness. Set frameset-ok to False when stray <body> is enountered
* Add a test for MathML entities, especially ones that expand to 2 UTF-16 code units.
* Test for spec bug 11156 - <input type=hidden> should not set frameset-ok to "not ok".
* Add a newline to the end of tests20.dat.
* Tests for annotation-xml rev 5509
* Change option parsing spec rev ]5488
* Complete null handling changes
* Phase 2 of the null handling changes
* Phase one of the null character handling changes
* Fix tests
* Add more tests for Noah's Ark
* Move hsivonen's test for Noah's Ark into a new file
* Add tests for AAA limits
* Change an old test to test the new iteration limit on the AAA inner loop and add a new test for the Noah's Ark clause.
* Fix test for spec fix to bug 10418
* Merge
* Undo one more bogus change
* Put pending changes file back to the way it should be
* Merge (somewhat botched)
* Remove incorrect whitespace
* Revert pending change for WONTFIX bug 10456
* Adjust tests to match http://www.w3.org/Bugs/Public/show_bug.cgi?id=10456 getting WONTFIXed.
* Remove tests that tested the removal the absence of the comment end space state from the pending tests because abarth already landed the tests in the non-pending tests.
* Undo rev 1619 restoring a text editor-unsafe test in entities01.dat.
* Tests for EOF in attribute states
* Sync tests with WebKit
* Make sure tests15.dat ends with a line feed.
* Make sure all tree builder test files end with a line feed.
* Change tests pre-emptively assuming that bug 9659 gets resolved to match Gecko and WebKit.
* Isolate tests that are affected by the resolution of spec bug 9659.
* Move tests that pre-emptively rely on anticipated spec changes into isolated files.
* Move a test with a text editor and text/plain-unsafe character into a separate file.
* Pre-emptively adjust test to assume spec bug 10456 gets fixed.
* Pre-emptively fix the tokenizer tests assuming that the comment end space state goes away.
* Pre-emptively fix the tests assuming that the comment end space state goes away.
* Test that the parser does not treat <spacer> as a void element.
* Test cases for spec rev 5300 adjusted for spec bug 10588.
* Add a test for spec rev 5297.
* Import new test cases from WebKit
* Make tests21.dat conform to the test file format.
* Add new tests for foreignContent stuff
* Remove tokenizer tests for CDATA since typically there is no treebuilder to hook into
* Add CDATA tests for foreign content
* Add tests for CDATA sections
* Merge
* Update to the latest spec
* Add some innerHTML tests
* Get html5lib passing tests again after 964568c175 on UCS2 Python. This checks explicitly for lone surrogates in the UCS2 case.
* Add file for converting the tokenizer tests to tree tests (assuming html5lib works with them correctly)
* Fix escaping
* Button is now a special element
* Fix up testcase for aaa foster parenting and whitespace
* Move tests that rely on scripting
* Fix expected output to include public and system ids
* Import test data from WebKit.  I'm not sure how to hook up these data files to the various test harnesses, but I figured adding the dat files was the first step.
* Remove blank line
* Remove duplicate tests
* Tests for spec changes
* Test that <figcaption> and <summary> close <p>
* button scoping tests
* frameset-ok tests
* Add tests for \ufffd before frameset
* Change <button> parsing to match the current spec. Will likely need to be (partially) reverted once the spec is fixed up
* Bugfix some tests and add a couple more
* More AAA tests
* More test coverage
* File missing from previous commit
* Move tests that are problematic in json or java to a single file. Add double escaping flag to sneak unpaired surrogates past over-zealous json decoders
* More tests to cover missing state transitions
* Spec rev 4959 - Do not expand entity reference in attribute value when the name is followed by = instead of ;.
* Also remove form elements that are the current node when encountering </form>
* Test that button is non-scoping. Spec rev 5032.
* Test that </datalist> closes <option>
* Align the isindex prompt with Firefox and Chrome. (Spec rev 4936)
* &#13; should map to CR. (Spec rev 4933.)
* Fix problem with unclosed scoping element and end tag html
* Merge.
* Fix grave accent in unquoted attr.
* Tests for misnamed attributes
* Use UTF-8 instead of Windows-1252.
* Add tests for body and html end tags before frameset.
* Change test to anticipate form pointer-sensitivity when <form><table><form>. http://www.w3.org/Bugs/Public/show_bug.cgi?id=8373
* Add test coverage for less than singn in the script double escaped dash states.
* Expect foster-parented text to coalesce.
* Restoring a wrongly removed parser error on &#X10FFFF;.
* Grave accent in unquoted attributes is now an error. Astral non-characters are no longer errors.
* Merge
* Add test for incorrect tree which only manifested itself in the test suite due to parse errors.
* Fix check for in scope node; fixes issue 126
* Fix issue 126 by making reconstructing active formatting elements always work with positive indicies
* Fix issue 127 remove stray argument to processEOF
* Update parser (and tests) to latest spec. Fix a couple of bugs in the tokenizer that only turned up in the tree construction tests.
* Merge.
* Update tokenizer.
* test quirks mode too; remove dup test, fix a Col:
* tests using patterns from real-world pages
* anti escape tests for the other elements
* more script tests
* work in progress script tests
* Fix a test where text nodes should be split
* Update tokenizer tests to match the 2009-09-29 spec changes to DOCTYPE tokenization. These extra parse errors assume http://www.w3.org/Bugs/Public/show_bug.cgi?id=8019 is added to the spec (which Hixie said it would be).
* Change CDATA to RAWTEXT (spec r3562). This breaks test-compat.
* This test case should fall back to default according to MIMESNIFF.
* Fix handling of source/param within "in body". Fixes #115.
* Allow DOCTYPEs to round-trip, keeping public/system identifiers.
* Update whitespace tests to latest spec, I think. Could be wrong
* Make testdata for surrogate handling match the current spec (I think)
* Merge to tip
* Implement r3852 for PHP: Allow <span title=&> since the syntax section says it's ok.
* Implement r3769 for PHP.  I fudged the refactoring of "in scope" that Hixie did.
* Fix probably-broken testcase
* Implement p-closing by xmp IE style, r3768.
* fix expected test result
* Move tests99 to a more sensible number as the spec has now changed.
* Merge to tip.
* Merge in changes from default (for clean re-merge).
* Fix more errors, and change implementation to be the most recent one.
* Merge to tip
* Make serializer tests pass
* Implement revised table foster parenting algo from r3382
* Initial implementation of numeric entities and tests, not complete, need spec clarification.
* Adjust tests for new parse errors in spec for less than sign in attribute names and unquoted attribute values
* Remove <p> from <isindex>, as per r3236
* Fix test
* Fix bug in comment end bang parse error.
* Fix tests and PHP impl as per r3196.
* Implement space after comment end state, as per r3195.
* Implement comment bang end state, as per r3191.
* Update tests and PHP for r3163, <keygen> breaks out of <select>
* Move frameset-ok test to un-specced tests.
* Add test for quirks mode handling of table when p is in scope.
* Add test and PHP impl for r3206 "make '<' in unquoted attribute values non-conforming.
* <frame> and </frame> do not set frameset-ok to false
* Revert incorrect test changes
* Revert erronous change to tests
* Resync with the mainline
* Pass all tree construction tests on this branch except whitespace-in-table tests
* Update test to match spec r3121.
* Add test case that a failed attempt (uncommitted) at fixing other bugs broke.
* Merge over svn r1304: discard tag token if EOF inside token
* Make all tests10 pass for PHP implementation.
* Merge geoffer's change, and fix the bug.
* Implement foreign content handling, and cause all tests9.dat to pass.
* Add tree construction test that causes a fatal error in the PHP implementation.
* Merge again
* Move more unspecced webkit style tests to tests99
* Move unspecced webkit style foster parenting tests to tests99.
* Fix test-suite bug, fix real bug with head pointer pop, move another test to 99.
* Add quirks handling, update Python doctype list, move some tests to 99.
* merge to tip
* Attempt at merging svgmathml branch to the default branch
* Move another test over, and fix a missing break.
* Move proposed spec change to special test file, so as not to pollute.
* Fix some ruby error messages missing parameters, and some test-case errors without tag names
* Fix broken test-case w.r.t. behavior of </html> in head.
* Fix one spurious test-case, also random updates to php
* Add test for plaintext in tokenizer. (This works fine even if the content model flag isn't changed to PLAINTEXT).
* Changing non-xml attributes
* Update the tree building tests with frameset-ok, new AAA and (not yet in spec) WebKit-style foster-parenting
* Fixes issue 91 by omitting the head element's start tag when the head element is empty.
* Fix attr-value-quoting test with line tab (U+000B)
* Implement r2708 -- 0xFDE0..0xFDEF are invalid characters
* Add start of SVG+MathML branch
* The spec now ignores punctuation in charset comparison
* Change tests to reflect recent hn and form handling spec changes
* A couple more XSS tests.
* Update tree-construction tests to account for lower-cased doctype names.
* Changed test case descriptions to be printable ASCII
* Updated automatically-generated tokeniser test cases
* U+000B in the input stream is a parse error (r2138)
* Updated tokeniser to implement r2123
* Resync my tree with the trunk. Adds support for coercing trees to xml infosets in particular for lxml (still need to wire up the tests) and some speed improvements in the parser. Big apologies for the large checkin, there are some regressions in the liberal xml parser and the sanitizer that need to be fixed.
* Tokeniser updates to match spec: missing attribute values (r2122), lowercase doctype names (r2502)
* Implemented and added tests for the new list of illegal numeric character references
* Added some failing tokeniser tests, and fixed them
* Accept space at end of style="x: y; " (related to issue 83).
* Test unquoted entity ending in ampersand (bug found by zcorpan)
* use the table variant of the element in scope algorithm when in select in table insertion mode
* first cut at an "in foreign content" insertion mode. most of the tests pass
* update to ruby impl. now passes all non-foreign-content tree-contstruction tests
* parsing updated related to EOFs in tables. exciting
* updating tests to reflect new handling of option and optgroup.
* updating in_head_phase.rb to work with <meta>, etc. in <body>
* Replace pre with an element name that actually can be an [R]CDATA end tag
* reinstating ParseError for self-closing end tag
* r2129 of spec: <optgroup> implies </option>
* Test for issue 80 (fails in BeautifulSoup)
* various treebuilder improvements to the ruby port. includes afterAfter phases
* various tree builder improvements. mostly ported from r1107, and a few others
* flesh out errors on parsing tests
* no tokenizer level parse error here
* Revert previous commit, based on a misreading of the spec.  (thanks Philip)
* "&COPY" in an attribute value should not get turned into an entity.
* add character reference buffering coverage, remove obsolete xml violation test
* In the document "<html></html><!-- foo -->", the comment should be the first node of <html>.
* "</html> <head>" should not insert a whitespace node into the document, since whitespace-only tokens are ignored in the "before head" mode.
* nested namespace tests. one test assumes that foreignObject is scoping. see http://www.w3.org/Bugs/Public/show_bug.cgi?id=5815
* add camelCasing tests
* Add basic foreign content tests
* Add test coverage for bogus end tag in body
* after head eats end tags, episode n+2
* after head eats end tags, episode n+1
* after head eats end tags, episode n
* after head eats end tags
* option and optgroup are now allowed in "in body"
* after head now eats all end tags
* option and optgroup are now allowed in "in body", more end tags are ignored in head
* Add test coverage for bogus Illustrator entities.
* entities expanding to end-of-plane non-charecters are now errors and turn into the REPLACEMENT CHARACTER
* EOF inside bogus doctype is no longer an error
* Take into account r1178 of HTML5's draft in the Python implementation (note that previous changes to the spec aren't yet implemented, this changeset doesn't thus make the implementation conforming to r1178, just to r1177-r1178 changes).
* Added a test for non-ASCII character reference names.
* Added test for tart tag with no attributes but space before the greater-than sign.
* Added test for a boolean attribute followed by a capital letter.
* give proper context for all tests
* give proper context for the PLAINTEXT test
* Only one error when EOF in PUBLIC or SYSTEM
* remove colon in attribute name tests, as colon stuff now needs to happen in the tree builder
* Use a real element name for content model flag tests
* Fix serializer test
* Make encodings insensitive to punctuation and use the correct codec in all cases
* Removed non-ASCII bytes from JSON files, to avoid simplejson portability issues. Fixed BeautifulSoup treewalker doctype/comment portability issues.
* Change the description of the test I changed in the previous commit, and add a test to check the new "=" behaviour. Also, re-order to make logical again.
* Disallow = in unquoted attributes, and allow <. The latter necessitates changing one serializer test (removing the quotes from the expected output).
* Fixed various BeautifulSoup bugs, including issue 70
* Introduce the self-closing flag. This check-in changes the test format. Will update the wiki accordingly.
* Fix number of parse errors
* Change some testcases to match the current spec
* use the new format for non-5 doctypes
* fix </form> test per spec rev 1320
* Added test for "--x>" not resetting the escape flag. Updated Python code to pass.
* Get whitespace in table rows right
* tweak tests for newly forbidden characters
* tests for XML 1.0 infoset-compatible behavior
* test closing body twice in the fragment case
* Lowercase most doctype names so the tests are sutible for XML libs that do not preserve this information. Add a test with public id in doctype not yet passing everywhere due to test serializers not having support
* move #document-fragment after #errors in order to avoid unnecessary variability
* Added a tokenizer test for permitted slash when the element has an attribute (there was a bug in Twintsam that this test case would have helped discover)
* InSelectInTable
* fix meta in table
* add more hidden input tests
* Python parser: support <listing> followed by newline; <style> & <script> in table; tainted tables; <title> everywhere; throw less voodoo parse errors; support <input type=hidden> in table; support <input> in in select; applet is scoped; add tests
* Updated tokeniser tests and Python to match r1306 of spec
* Updated tokeniser tests to match r1303 of spec
* Updated doctype-parsing tokeniser tests and code to match updated spec
* Fixed JSON syntax error. Fixed misspelling of "Contributors".
* a bit more test coverage
* Test to ensure <image> is sanitized.
* Updated tests.
* Tests for sanitization of url ref's in SVG attributes.
* Add error message checking. This required updating many of the error messages and fixing a few minor bugs.
* Don't crash and burn when non-ascii characters are found in the pre-parse
* more test coverage
* Several changes related to character encoding; convert utf-16 to utf-8 if found in pre-parse algorithm, allow chardet to be switched off, start implementing reparsing if <meta> found during actual parse (not yet complete)
* re-ordering the tests, per the wiki
* more test coverage for in table phase
* more test coverage for table body phase
* more test coverage of row phase
* more test coverage.
* more test coverage for in column group phase
* more test coverage of in_body_phase
* use the right error message (and test the right thing)
* --HG-- extra : convert_revision : svn%3Aacbfec75-9323-0410-a652-858a13e371e0/trunk%401029
* increase test coverage on AfterFramesetPhase
* fixing problem (and adding test) for <body> appearing in innerHTML mode
* minor error in validator.py, validator.rb already passed these tests
* Fix (the rest of the) tests so Ruby JSON module doesn't barf.
* Fix tests so Ruby JSON module doesn't barf.
* Fixed consume_entity in the ruby version and added unit test to ensure  non-regression.
* svn:eol-style=native
* Testcase
* added support for validating a whole bunch of stuff that I can't remember right at the moment
* added support for validating base href attribute
* added support for validating <base target> attribute
* added support for validating <html xmlns> attribute
* added support for validating tabindex attribute
* added support for validating lang attribute
* --HG-- extra : convert_revision : svn%3Aacbfec75-9323-0410-a652-858a13e371e0/trunk%40982
* added support for validating dir attribute
* added support for validating contextmenu attribute
* added more tests for validating id attributes
* added support for validating id attributes
* more tests for validating contenteditable attribute
* added support for validating contenteditable attribute
* added support for validating class attribute values (space-separated token lists)
* synced allowed attributes of various form elements with WF2 appendix A
* added tests for attributes on non-input form elements
* added tests for deprecated size attribute on put element
* refactored validator filter, added attribute tests for input element
* more attribute existence tests
* attribute existence tests for conformance checker
* Added some new tokenizer tests.
* fixing encoding problem reported by gsnedders
* beginnings of sniffing implementation
* Wallpaper over crash to do with updating position in stream. Fails one test to do with position calculation but this is a temp. fix
* Added new tests for (decimal and hexadecimal) numeric entities with Windows-1252 values or CR (0x0D, to be converted to LF: U+000A). There were some tests already in test2.test, they've been replaced with the new ones (i.e. removed from test2.test).
* Adds new tests for named entities requiring a semi-colon, to ensure they're not recognized when the semi-colon is absent.
* Added unit-test for each named entity (with and without trailing semi-colon). All new 366 tests pass in both the Python and Ruby implementations.
* Fixed whitespace-stripping serializer tests re recent behavioral change in the serializer.
* adding a space to fix the expected result match the format documented on the wiki
* fix test format around vertical bar
* fix attribute sort order
* space characters outside the root element do not go into the DOM anymore
* formatting elements are reconstructed on space as well
* fix attribute sort order
* tweak test cases to match spec (formatting elements are reconstructed on space as well)
* fixing attribute sort order in test data per IRC discussion on what the sort function should be
* Test EOF when frameset is open (not in the spec yet, but the head/body inference is not either
* Various extra tokeniser tests
* Added a tokeniser test that trips up some implementations
* Added tokeniser tests - almost all automatically-generated, covering all the steps in the spec that are reachable with PCDATA.
* Fix comment with leading dash
* Clean up test serialization of no-name doctype case
* A few more cases where str data is being initalized rather than unicode)
* add some simple <noscript> in <head> support; (scripting 'enabled')
* make <nobr> handling match the specification
* add more tests
* make tests5 work
* enable parse error checking for Python; still some tweaks needed
* end tag list items didn't properly report parse errors
* fix more parse error differences
* fix some parse errors
* Updfate encoding tests to new parser
* Fix incorrect tests for whitespace handling after <pre> and <textarea> (bug hidden by old test harness)
* Update fragment tests to generic format
* bleeding edge entity handling
* introduce </p> handling; </br> handling is now conforming per the specification
* Adding test for NCRs expanding to surrogates. You get a parse error and a REPLACEMENT CHARACTER for each surrogate--even if paired.
* The spec says: "Otherwise, if the number is zero, if the number is higher than 0x10FFFF, or if it is one of the surrogate characters (characters in the range 0xD800 to 0xDFFF), then this is a parse error;"
* The spec says: "All U+0000 NULL characters in the input must be replaced by U+FFFD REPLACEMENT CHARACTERs. Any occurrences of such characters is a parse error."
* implement </form> handling; spec change was a while ago
* new entity handling
* Escape RCdata option for xhtml compatibility
* Add XHTMLSerializer (same as HTMLSerializer, only w/different defaults)
* Work-around for unichr limitation to UCS-2 using eval().
* escape_lt_in_attrs serialization option
* several end tags now imply start tags
* Added support for <meta http-equiv="Content-Type" content="..."> in inject_meta_charset filter (Python only) along with a few tests.
* Escape angle brackets even when a character encoding is specified. Ultimately we will need an option to escape brackets when found in attribute values to keep the XHTML crowd happy.
* <link>, <base> and <meta> are no longer moved to <head>, unless in very special cases
* implement new <nobr> handling and add testcases for <nobr>
* fix test from hsivonen
* new-style comment handling
* IE7-style <h1>-<h6> handling
* handle the new-style entities
* Convert test to JSON
* enable tests5 and add another test
* make comments inside CDATA and RCDATA work; someone please review the HTMLInputStream regression
* adding tests for the escape flag
* remove a parse error and useless check in the close tag open state per spec change and update test to match that
* Convert from Python to JSON
* fix some DOCTYPE tests and add a few new ones to test publicId and systemId
* fix tokenizer tests; implement null in our simplejson
* land the new DOCTYPE handling; still things to be fixed
* introduce </br> and make it possible to add </p> and maybe others later
* add an LF
* fix two encoding tests for hsivonen
* fix sanitize tests except for one
* remove special handling for <; not sure how to fix sanitize tests
* Commit test case from issue 45
* add a few tests that test comment parsing inside RCDATA and CDATA blocks
* Inject meta tests
* Fix to implied end tag error in li,dt,dd parsing
* Make a common testdata directory, shared between python and ruby
* Port sanitize tests from ruby to python (four currently fail)
* Fix to take into account markup within <pre> when stripping whitespace and added unit tests.
* oops, fix test
* drop leading newline for <textarea> too
* get optionaltags tests working again
* Fixed tests re. attribute value quoting in serialization (attribute values use the "best" quote character depending on the attribute value, defaulting to " when it contains both " and ')
* Test: start-tags with attributes are never optional (test uses <html lang=en>)
* Serializer tests for optional tags no longer contain the serialization with optional tags *not* omitted. This is now tested within the tests python code (which makes it easier to disable such a test to ensure optional tags *are* omitted)
* Added serializer tests for optional tags (I think they're complete wrt the current HTML5 draft)
* Added some serializer tests for optional tags
* Fixes in HTMLSerializer and additional serializer tests.
* Don't report NotImplementedError plus some cosmetic changes
* More crlf and svn ignore
* Added some serializer tests
* Fix end of line characters
* Added some innerHTML unit tests. They lack parse errors in the #errors section and fail with the DOM tree builder due to the absence of DocumentFragment.
* Fix issue 32 Inverted chars when tokenizing in RCDATA content model
* Bugfix in inhead phase
* Rework <meta detection to better handle reaching the end of the stream and clean up code
* Meta correctness fixes
* Null byte replacement fix
* change parse.py to not import html5lib; fix a bug in endTagP handling; add a regression testcase for that; make a comment in _base.py clearer; add some more parseError messages
* More char encoding fixes. Better list of encodings. Strip leading and trailing whitespace from encoding attr
* Initial testcases for encoding detection
* More <pre> newline edge case fixes
* Some fixes for whitespace in <pre> handling
* Drop newline at the start of <pre> blocks
* fix another testcase
* fix some testcases to reveal more bugs (while fixing some) and add a note in the after body phase
* add a parse error to processEOF in head and fix a testcase and fix two other parse error messages
* fix a bunch of testcase, fix entity error message in tokenizer and fix some error messages in the parser
* fix some testcases and make sure we no longer move <style> to <head> when it's in <body>
* fix tests
* new tests for handling of script/style around head
* change processEOF, add error messages and fix a testcase
* add testcase for EOF handling: <!--x--
* fix three tests
* Fix a a few parse errors to be correctly emitted and add a global in test_parser.py to control whether the errors are checked in the parser tests
* Add support for initial content model flags in test framework and tests courtesy of Thomas Broyer
* Move parse error in Unfinished comment to before the comment, as for all the other tests
* Moving unescaped < test parse error to the point in the stream where it actually occurs (need a generic solution for this kind of problem since some imps report erros at different times
* Spec requires 2 parse errors for the doctype without a name test (maybe this is a spec issue?)
* fix some more bugs related to parse errors
* add a testcase for / in the tagname; make a start with saying what the ParseErrors actually are in the tokenizer using gettext to ensure potential localization in the future; feel free to remove typos and to improve the text
* fix two tests, try fixing test_tokenizer a bit
* minor cleanup
* Add second set of tokenizer tests, courtesy of Thomas Broyer
* add some trailing end testcases; put all phases into HTMLParser.phases; introduce self.lastPhase for interaction between 'main phase' and 'trailing end state' as mentioned in the spec; nuke switchPhase, switchInsertionMode; nuke MainPhase; move TrailingEnd to the well, trailing end...; classes that inherit from Phase end in Phase; testcases still pass; web-apps.htmin around 5 CPU seconds
* move processing of <html> to the various insertion modes; step 1 in nuking the main phase... (also add testcases for handling of the <html> tag, nothing was testing it...)
* introduce SpaceCharacters
* fix endTagSelect in InSelect and add a testcase for it
* introduce the full web-apps.htm and keep move the old one to web-apps-old.htm in case we want comparisons
* add two more testcases: both about nodes in the <body> that need to be moved to the <head>
* add another multiline testcase
* simplify test_parser() in test_parser.py; now the new lines are no longer needed
* fix parse.py to work with multiline input; do the same for test_parser.py; remove the #data at the end of the two test files, test files require two new lines at the end for now; add a testcase which has a new line; make some editorial changes in parser.py
* fix <isindex> parsing
* change 'comment dash state' and add three regression testcases for it
* add some test files
* <input> needs to be handled as well
* change how InSelect works a bit and add some testcases to test InSelect handling
* fix two bugs in InCaption and add a regression testcase
* fix a bug in the root element phase and add a regression testcase
* implement processNonSpaceCharacter in 'after body', trim whitespace and add a testcase
* improve charsUntil and put it to use
* add two more entity tests and make a trivial comment change in the tokenizer
* update README
* new test
* rewrite of def reconstructActiveFormattingElements to match the specification and also commit a testcase that we fail for unknown reasons so far :-(
* handlePEndTag -> endTagP and add some regression testcases while I'm at it
* add a couple of simple entity testcases; simplify a structure in tokenizer.py
* add a <script> parsing testcase
* fix an EOF bug in the tokenizer and add a testcase to make sure we don't regress in the future on that; also add a weird attribute testcase
* add a new testcase testing multiple body start tags
* fix a bug and add a testcase to make sure we don't regress it in the future
* error in AAA test
* Test with two adjacent text nodes was failing as we concatenate the nodes. Change test
* New, improved HMTLInputStream. Now fast enough that you won't even notice it's there.
* add two <plaintext> tests
* make sure the last test is tested as well (workaround, bug reported)
* add a testcase <script></x which the tokenizer borks on...
* add two more tests
* since consecutive text nodes are not possible as output of the parser the tests should not assume they are
* add some <frame>/<frameset> tests
* fix some table parsing issues
* Add error message information; correct the last test
* add some tests although #error still needs to be done...
* Check in the right file this time
* oops, these aren't errors
* 112 parsing tests contributed by Google under the MIT license
* Remove references to nose in README file
* add a newline to tests/README and start with inRow
* Add tests readme file
* I wrote some parser.py code on the plane OSL->AMS
* add a regression test for <>
* add a simple testcase
* Fixes to deal with entities that partially match longer entities + a few more test cases
* Allow tokenizer test to pass if the expected token stream is found anywhere in the output. Also allow consecutive character tokens to be concatenated
* Check for EOF in a few places when consuming code, with accompnying tests for several cases (need more partial entity tests in particular)
* A few more tests
* Update tests to new format (running tests requires simplejson)
* Add some initial testing code for the tokenizer only. We want to replace this with something better ASAP
* fix an windows1252entity
* remove the entities folder and fix the "windows trick" because it was broken
* more fixes to entities and fix doctypes
* make number entities work
* make sure we actually switch to the attributeName state and some smaller fixes. also change the testcase
* Test files for UTF-8 and US-ASCII encodings
* make mockParser.py working when you execute it and update the testfile and fix a few bugs in the tokenizer
* move things to trunk/

v0.3.16
=============

* Bump version to 0.3.16 and dependency on jsdom to 0.9.0
* Remove todos from passings tests
* Skip todoed tests
* Merge pull request #103 from ibash/master
* Stop overriding array.last, refactor to last(someArray) fixes #101
* Remove obsolete documentation
* Drop support for node 0.6 and 0.4
* Merge pull request #97 from darobin/ruby
* use the list actually specified in http://www.w3.org/html/wg/drafts/html/master/single-page.html#generate-implied-end-tags
* Merge pull request #96 from papandreou/namedEntitiesPerformance
* Use a better algorithm for keeping track of the recognition of named entities.
* Stop reinitializing parser in parse_fragment. Fixes #94
* Improve debug output
* Tidy indent
* Fix syntax error in package.json
* Merge pull request #95 from roylines/master
* corrected repository information in package.json. It should be singular

v0.3.15
=============

* v0.3.15
* Merge pull request #93 from arlolra/optional
* Make jsdom an optional dependency.
* Merge pull request #88 from aredridel/update
* Call buffer.commit() in rcdata/rawtext/plaintext states
* Add new rcdata/rawdata/plaintext states instead of content models
* Merge pull request #90 from arlolra/private
* Merge pull request #91 from arlolra/dom4
* Attributes no longer inherit from Node in DOM4.
* Only use jsdom private apis when available.
* Merge pull request #89 from arlolra/ee
* Call EventEmitter in TreeWalker constructor.
* Fix fragment parsing, reset framesetOk flag
* Update parsing algorithm according to current spec
* Handle '<' character in attribute name begin as invalid.
* Misc fixes in parser
* Impove doctype handling
* Improve foreign content handling
* Serialize doctype publicId and systemId
* Fix entity, doctype tokenizing, refactor empty tag handling.
* Add missing messages, improve error handling
* Add todos to four tests

v0.3.14
=============

* v0.3.14
* Bump jsdom dependency
* Add DanyaPostfactum as contributor
* Remove unused core
* Move root creation code to TreeBuilder.insertRoot()
* Use Object.defineProperty instead of __defineGetter__
* Use tape instead of tap
* Better error handling in attributes
* Fix heading nesting detection
* use Object.keys
* Merge pull request #85 from danyaPostfactum/mistype
* Fix more mistypes in error messages
* Fix mistype in endTagBlock
* Restore "tap" dependency.
* Fix mistypes
* Fix mistype in error message

v0.3.13
=============

* v0.3.13

v0.3.12
=============

* v0.3.12
* EventEmitter.call(this) in tokenizer
* Properly inherit from EventEmitter in treewalker
* Try to avoid materializing arguments in debug code
* test against node 0.10
* whitespace
* Update dependencies
* Use util.inherits
* v0.3.11
* Commit parser state after adding characters to doctype name.
* Merge pull request #74 from metamatt/master
* Bring in the assert module, since it's used here.
* Merge commit 'ce5fdde58e26612772b020acb40fb93a1b7caa5f'
* Remove doc/jquery-example. Fixes #45
* Add var keyword to prevent global leak

v0.3.10
=============

* v0.3.10
* Remove dependency on async
* Move tap and bench dependencies to devDependencies
* Use jsdom internal attributes to set invalid attribute names
* Use jsdom private API to create elements with otherwise invalid tag names

v0.3.9
=============

* v0.3.9
* Formatting in constants.js
* Separate entities into a separate module
* Add cdata section handling
* Add shebang to tools/parse-test-data.js
* Remove submodules
* Remove some todo markers
* Lint the tokenizer
* Remove debugging from hot path
* Reference secondary_phase directly
* Reference the current phase directly
* Remove support for constructed phases
* Move the phase code entirely into the parser routine
* Internalize inBody
* Internalize trailingEnd
* Internalize rootElement
* Internalize inRow
* Internalize inSelectInTable
* Internalize inSelect
* Internalize inTableBody
* Internalize inTable
* Internalize inHead
* Internalize inFrameset
* Internalize inForeignContent
* Internalize inColumnGroup
* Internalize inCell
* Internalize inCaption
* Internalize beforeHTML
* Internalize beforeHead
* Internalize afterHead
* Internalize afterFrameset
* Internalize afterBody phase
* Internalize afterAfterFrameset
* Internalize afterAfterBody
* Move tree variable into closure
* Start moving parser phases into the main parser body
* Add build products to .gitignore
* Add ronn devDependency
* Simplify some conditionals and code formatting
* Export single functions rather than an object
* Add node_modules to .gitignore
* Add shebang to test
* Correct expected test result per section 8.2.4.54
* Merge pull request #68 from chase/quickfix
* EOF messages are very frequent, debug messages aren't very useful then, and getter/setter methods are expensive.
* Cache the keys of the HTML5 entities. Iterating the keys of objects is expensive.
* Merge pull request #65 from debonet/patch-1
* Update lib/html5/tokenizer.js
* Merge pull request #64 from soldair/master
* Make parse-doc executable
* fixes tests. sometimes docuent is a document element?
* call to document.appendChild should be document.documentElement.appendChild
* Test with node 0.8
* Merge pull request #63 from leakin/patch-1
* Update lib/html5/tokenizer.js
* Merge pull request #61 from gwicke/master
* Issue #60: Reset open_elements and activeFormattingElements
* Yeah, node 0.4 doesn't work. Upgrade already.
* Specify language in .travis.yml

v0.3.8
=============

* v0.3.8
* Add TODO tests
* Add .npmignore

v0.3.7
=============

* v0.3.7
* Example showing issue parses correctly. Closes #59
* Merge pull request #58 from yourcelf/master
* more var keywords, and two variable name errors
* Merge pull request #57 from npcode/master
* Add var keyword to fix global leak.
* Merge pull request #56 from yourcelf/master
* declaring more vars to avoid global leaks
* add var keywords to avoid global leaks
* Remove spurious todo, add another
* Split test data into separate files; add support for TODO tests
* Add .gitignore

v0.3.6
=============

* v0.3.6
* Merge pull request #54 from gwicke/master
* Use more efficient push/reverse
* Merge pull request #53 from gwicke/master
* Restore original attribute order in normalize_token
* Merge pull request #52 from doochik/patch-1
* Update doc Right event name is "end", not "done"
* Merge pull request #50 from brianmcd/master
* Fix undefined reference to PHASES.
* Reference 'PHASES' on the required object
* Merge pull request #49 from quangv/master
* Removed global variable p, made local
* Removed global varibles t & b, made local
* Removed global variable PHASES, made local
* Make tap runner work when only installed locally
* Merge pull request #48 from aeosynth/master
* The "sys" module is now called "util"
* Remove .swp file
* Use latest entity table from the spec
* Add performance benchmark script
* Update tap and add bench
* Rewrite tokenizer to be more functional
* Fix scoping in select in table phase
* Improve nulls in data_state
* Fix indentation of test output in empty tags
* Rework endTagMarqueeAppletObject
* Continue reworking inScope
* Start reworking inScope
* Don't emit empty CDATA for empty scripts
* Improve debugging of script chunking
* Handle another weirdness in the test data parsing
* Carry on, badly, when jsdom refuses to make an element like div<div
* Make an empty string a valid parseable document
* Simplify reading test data and make more permissive
* Fix mispassing of attributes from after_body_phase
* Improve debugging output
* Fix EOF handling in markup_declaration_open_state
* Fix debugging typos
* Fix EOF handling in tag_open_state
* Fix EOF handling inside SCRIPT_CDATA
* Add some debugging to inHead phase
* Stringify content model flags
* Fix EOF in consume_entity
* Fix EOF in consume_entity
* Add more test data
* Make matchWhile and matchUntil return '' rather than EOF.
* Fix EOF in several states
* Fix EOF in attribute_name_state
* Fix EOF in before_attribute_name_state
* Fix EOF in data_state
* Fix EOF in bogus_comment_state
* Handle EOF in comment_state and comment_dash_state
* Simplify test harness; fix EOF bugs in data_state
* Add missing data/tree-construction/plain-text-unsafe.dat
* Fix permissions on test data
* Update test data
* Refactor and update conversion of numeric entities
* Handle rp and rt tags in the body phase
* Change in HTML5 spec around <title> inside <body>
* Fix handling of EOF in attribute_value_unquoted state
* Allow debug flags to be set in test code
* Fix EOF handling in attribute_value_double_quoted_state
* Fix parser state with EOF at token_name_state
* Make buffer cope with new HTML5.EOF
* Make HTML5.EOF token unstringable, so that it throws an exception
* Make skip-to-test code more obvious
* Remove changelog code from makefile
* Makefile cleanups

v0.3.5
=============

* v0.3.5
* Fixups to buffering
* Documentation cleanup. Closes #42
* More test fixes; improve tokenizer some; add buffer debugging
* Don't do a dumb and add \0
* s/vows/tap/
* s/sys/util/

v0.3.4
=============

* v0.3.4
* Merge pull request #36 from brianmcd/master
* When buffering script tag data, also buffer SpaceCharacters.

v0.3.3
=============

* v0.3.3
* Catch JSDOM exceptions (such as they are, thrown strings)
* Remove jQuery dep, since it's now bundled with jsdom
* Fix parse-test-data script
* Fix serializer glitch
* Change EOF and DRAIN constants
* Avoid using full regexps where just a character class is needed
* Fix paths in parse-doc
* Use new jsdom api
* Add 'code' element to formatting elements list
* Update URL in readme
* Remove unneeded test.js
* finish re-arranging tests
* Re-arrange tests
* No longer require('sys'), a first step to being able to use the parser clientside.
* Clean up package.json
* Make tests named how vows expects, and add travi-ci configuration

v0.3.2
=============

* Release v0.3.2
* Update vows dependency to work with node 0.5

v0.3.1
=============

* v0.3.1
* fix issues 32 bug

v0.3.0
=============

* v0.3.0
* Merge pull request #31 from codders/master
* Change parsing of scripts to emit executable data on tag close
* Convert serializer test to vows
* Switch to vows; split streaming tests out
* move tests into test/

v0.2.16
=============

* v0.2.16
* No, really, write proper JSON. Come ON, Aria!
* Start moving deps into `node_modules/`
* Fix my stupid syntax error in package.json
* Update package.json to mention engines
* Clean up the README
* Rely on npm to set up dependencies
* Handle the two ways jsdom could be loaded for now

v0.2.15
=============

* v0.2.15
* Update jsdom
* Fix `ENTITIES_WINDOWS1252`. Thank you github.com/applegrew
* Add invalid-attr test files

v0.2.14
=============

* v0.2.14 and use html5/index.js as the main script

v0.2.13
=============

* v0.2.13
* Omit erroneous title tag in test viewer
* Clone attribute nodes when inserting.
* Add a huge pile of new test data from the html5lib project
* Remove verbose tree dump from test bed
* simplify the inScope definition
* Fix links to non-zero numbered tests
* Fix tests5/0
* Make parse-doc output test serialization data
* Clean up test viewer output
* Add express-based test viewer
* Fixes an issue if you add random 'hash keys' to the Array object such as a function definition.
* Clean up test parse-doc output for empty tags
* Update jquery, jsdom, nodeunit and ronnjs submodules
* Log a debug message if generateEndTags has no open tags
* `parser.reset_insertion_mode` expects a parameter

v0.2.12
=============

* v0.2.12
* Fix missing library reference in parser. Fix occasion where using toLowerCase() on an undefined tag name.

v0.2.11
=============

* v0.2.11
* Fix README and add example.js for new JSDOM API

v0.2.10
=============

* v0.2.10
* Debug properly

v0.2.9
=============

* v0.2.9
* Fix parsing into document with elements present
* update jsdom submodule

v0.2.8
=============

* 0.2.80.2.80.2.80.2.80.2.80.2.80.2.80.2.8
* Add eacute; (with semicolon)

v0.2.7
=============

* v0.2.7

v0.2.6
=============

* v0.2.6
* add beaconpush.com snapshot to test data
* Use new nodeunit API
* Update jsdom
* Convert byte-escaped entities to unicode codepoints
* Turn off quoting of attribute values in the parse-doc tool, if only to show off HTML5's very not XML syntax.
* Serialize attributes with = in them quoted always; re-arrange test data and add test case
* add npm note to readme
* Simplify doc names
* Remove boilerplate from docs; Document done event on parser
* Set lowercase to true by default; document the lowercase option
* Improve API documentation for serializer function

v0.2.5
=============

* v0.2.5
* Expose options to serializer; implement empty tag handling
* Don't skip out of head if there's \n in <head>. How on earth did I miss this one for so long?
* Update jsdom
* Debug for token emission
* Merge in tools#
* Add parse-doc.js, to use to parse a file of HTML
* unshift rather than appending paths for tests
* Start docs
* Merge in node-doctemplate for a start on docs
* Update jsdom
* Unshift paths in testbed, so that system copies aren't used
* Separate MathML and SVG fixups
* Update JQuery
* Mode todos!
* Actually enter bogus doctype state to handle non-HTML5 doctypes
* Emit a 'setup' event so one can attach to the tokenizer
* Throw errors on undefined input
* - add index.html
* add README.md
* - add DOCUMENTATION note
* templatize some parts I missed
* Initial commit

v0.2.4
=============

* bump version
* Clear the jsdom document created in createWindow

v0.2.3
=============

* use lib directory setting in package.json
* Use fully relative paths internally
* add main to package.json
* Add package.json

v0.2.2
=============

* Consolidate entirely into lib/html5/, using index.js
* Move docs into doc/
* Remove NEWAPI
* Add nodeunit as a submodule
* Add jquery as a submodule

v0.2.1
=============

* Allow more selective test running if desired
* Fix whitespace in readme
* improve README
* Put example and features into the readme
* Remove extra DOM require
* Update readme
* Remove obsolete JSDOM notes
* Use markdown for todo
* s/markdown/md/
* Update TODO
* add jquery example
* Use jsdom that can select parsers
* Separate out the creation of basic structure elements
* Clean up fragment parsing
* Update jsdom
* Fix process_solidus_in_tag to not over-shift the buffer
* Use tmpvar branch of jsdom
* Update jsdom to include backtraces from exceptions
* Update jsdom submodule
* - update gitmodules
