sys = require('util');
ping = require('pingwrap');

ping('www.google.com', function(error, stdout, stderr) {
	return sys.puts(stdout);
});
