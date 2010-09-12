* Use DOM.HTMLDocument rather than DOM.Document

* move to a more functional style -- having to call new inBody(blah).method
  rather than inBody.blah stinks

* Work on encoding detection and support. I'm sure this will involve a lot
  of moaning about Javascript's and V8's encoding support in the string
  objects.
