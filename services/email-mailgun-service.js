const cote = require('cote');
const mailgun = require('mailgun-js');  // https://documentation.mailgun.com/en/latest/quickstart-sending.html#send-with-smtp-or-api

const constants = require('../emailer/constants');

const mg = mailgun({apiKey: constants.MAILGUN_API_KEY, domain: constants.MAILGUN_DOMAIN});

const emailResponder = new cote.Responder({
	name: 'email mailgun requester',
	namespace: 'email mailgun',
	respondsTo: [ constants.MSG_SEND_EMAIL ]
});

emailResponder.on('*', console.log);

emailResponder.on(constants.MSG_SEND_EMAIL, (req, cb) => {
	const { to, cc, bcc, subject, from, text } = req.apiData;
	// TODO: validate/sanitise input data

	const opts = { to, cc, bcc, subject, from, text };

	mg.messages().send(opts, (err) => {		
		if (err) {
			cb({service: 'mailgun', errorDetail: err});
			return;
		} 
		cb(null, {service: 'mailgun'});
	});
});
