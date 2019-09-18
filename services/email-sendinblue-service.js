const cote = require('cote');
const constants = require('../emailer/constants');
var sendinblue = require('sendinblue-api');

var parameters = { apiKey: process.env.SENDINBLUE_V2_API_KEY };
var sendinObj = new sendinblue(parameters);

var emailResponder = new cote.Responder({
	name: 'email sendinblue requester',
	namespace: 'email sendinblue',
	respondsTo: [constants.MSG_SEND_EMAIL]
});

emailResponder.on('*', console.log);

emailResponder.on(constants.MSG_SEND_EMAIL, (req, cb) => {
    const { to, cc, bcc, subject, from, text } = req.apiData;
	// TODO: validate/sanitise input data

    // massage data into format desired by sendinblue
    toObject = to.reduce((result, item, index, array) => { result[item] = ''; return result; }, {});

    const opts = { 
        to: toObject,
        cc: cc,
        bcc: bcc,
        subject: subject,
        from: [ from ],
        text: text,
        html: text
    };

    sendinObj.send_email(opts, (err, res) => {
        if (err || (res && res.code && res.code === 'failure')) {
            const errorDetail = err || (res && res.message ? res.message : 'Unknown error');
			cb({service: 'sendinblue', errorDetail});
			return;
        } 
		cb(null, {service: 'sendinblue'});
    });
});
