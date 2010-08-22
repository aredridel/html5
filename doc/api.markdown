$PROJECT -- $DESCRIPTION
============================================================================

## Synopsis

An example: 

    code here

## $PROJECT.$Object

Description of `$Object`

### Properties

* `$property` of `$Object`

### Event: '$Event'

`function($prototype) { }`

Emitted when $description

### $PROJECT.$FUNCTION($parameters)

Description of $FUNCTION

`function(helodata) {}`

Emitted when a client sends the `'HELO'` or `'EHLO'` commands.

The `'helodata'` object has the following properties:

* `'name'`, the argument given to the command
* `'valid'`, whether or not the command will be accepted. Can be set to
  false to reject the helo name. Defaults to `true`.
* `'extended'`, `true` if the client is using ESMTP

You will most likely want to use the same callback for both events:

    var f = function(helodata) {
       if(/invalid/.test(helodata.name)) helodata.valid = false
    }
    connection.on('HELO', f)
    connection.on('EHLO', f)

### Event: 'MAIL FROM'

`function(sender) {}`

Emitted when a sender is specified by the client.

The `'sender'` object has the following properties:

* `'address'`, the SMTP address specified
* `'valid'`, whether the address will be accepted. Can be set to `false` to
  reject a sender. Defaults to `true`.

### Event: 'RCPT TO'

`function(recipient) {}`

Emitted for each recipient the client specifies.

The `'recipient'` object has the following properties:

* `'address'`, the SMTP address specified
* `'valid'`, whether the address will be accepted. Can be set to `false` to
  reject a sender. Defaults to `true`.

### Event: 'DATA'

`function(message) {}`

Emitted when the client begins sending message data.

The `'message'` object has the following properties:

* `'sender'`, the SMTP sender object
* `'receivers'`, an array of SMTP receiver objects
* `'connection'`, the `'smtp.Connection'` object
* `'accepted'`, whether or not confirmation that the message has been
  received will be sent. Defaults to `false`. Can be set to `true` if you're
  sure you've really accepted responsibility for the message.

It implements the `Readable Stream` interface.

### Event: 'RSET'

`function() {}`

Emitted when the client issues a reset command

### Event: 'QUIT'

`function() {}`

Emitted when the client quits, before the socket is closed

### Event: 'EXPN' (work in progress)

Emitted when the client issues an expand aliases command
