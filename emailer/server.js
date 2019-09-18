const app = require('express')();
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const cote = require('cote');

const constants = require('./constants');

app.use(bodyParser.json());

// TODO: add authorisation
// TODO: Check sendinblue account is authorised to send transational emails
//          at time of writing the code returns success but with a message as 
//          'The transactional mails has not been activated for your account, please contact our support team'

const emailMailgunRequester = new cote.Requester({
	name: 'email mailgun requester',
	namespace: 'email mailgun'
});

const emailSendInBlueRequester = new cote.Requester({
	name: 'email sendinblue requester',
	namespace: 'email sendinblue'
});

const logRequester = new cote.Requester({
	name: 'logger requester',
	namespace: 'logger'
});

app.all('*', (req, res, next) => {
	console.log(req.method, req.url);
	next();
});

app.get('/favicon.ico', (req, res) => res.status(204));

app.post('/email', (req, res) => {
	const { to, cc, bcc, subject, from, text } = req.body;

	// priority goes to mailgun
	emailMailgunRequester.send({
		type: constants.MSG_SEND_EMAIL,
		apiData: { to, cc, bcc, subject, from, text }
	}, (err, emailRes) => { 
		if (err) {			
			// log the error, but don't send error details to the client
			logRequester.send({ type: 'log', api: '/email', method: 'get', status: 500, service: 'mailgun', err: err, res: emailRes }, (logErr, logRes) => {});

			// failover to sendinblue
			emailSendInBlueRequester.send({
				type: constants.MSG_SEND_EMAIL,
				apiData: { to, cc, bcc, subject, from, text }
			}, (err, emailRes) => { 
				if (err) {
					// log the error, but don't send error details to the client
					logRequester.send({ type: 'log', api: '/email', method: 'get', status: 500, service: 'mailinblue', err: err, res: emailRes }, (logErr, logRes) => {});

					// TODO: consider adding this to a dead letter queue, for other subsequent processing
					res.status(500);
					res.send();
					return;
				}
		
				// logging success (TODO: limit this logging to development only)
				logRequester.send({ type: 'log', api: '/email', method: 'get', status: 200, err: null, res: emailRes }, (logErr, logRes) => {});
		
				res.status(200);
				res.send();
			});
		}

		// logging success (TODO: limit this logging to development only)
		logRequester.send({ type: 'log', api: '/email', method: 'get', status: 200, err: null, res: emailRes }, (logErr, logRes) => {});

		res.status(200);
		res.send();
	});
});

server.listen(constants.PORT);
