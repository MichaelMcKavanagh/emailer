import test from 'ava';
import cote from 'cote';

const constants = require('../../emailer/constants');
const emailMailgunService = require('../../services/email-mailgun-service');

test('automatic pass', t => {
	t.pass();
});

test.cb('get email service', t => {
    t.timeout(10000);

	const emailMailgunRequester = new cote.Requester({
        name: 'email mailgun requester',
        namespace: 'email mailgun'
    });

    const apiData = { 
        to:  [ 'michaelmckavanagh@gmail.com' ], 
        cc: 'michaelmckavanagh@gmail.com', 
        bcc: 'michaelmckavanagh@gmail.com', 
        subject: 'hello world api!', 
        from: 'michaelmckavanagh@gmail.com', 
        text: 'hello world!!!'
    }

    // TODO: as this is a unit test, it should be mocking the actual email, but I don't have time at the moment :)
	emailMailgunRequester.send({ type: constants.MSG_SEND_EMAIL, apiData }, (err, res) => {
		t.falsy(err);
		t.is(res.service, 'mailgun');
		t.end();
	});
});
