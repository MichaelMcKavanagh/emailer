import test from 'ava';
const axios = require('axios');

const MAILGUN = 'mailgun';
const SENDINBLUE = 'sendinblue';

test('automatic pass', t => {
	t.pass();
});

test('/email', async (t) => {
	await axios
		.post('/email', { 
			to: [ 'michaelmckavanagh@gmail.com' ], 
			cc: 'michaelmckavanagh@gmail.com', 
			bcc: 'michaelmckavanagh@gmail.com', 
			subject: 'hello world api!', 
			from: 'michaelmckavanagh@gmail.com', 
			text: 'hello world!!!'
		})
		.then((res) => {
			t.is(res.status, 200);
		})
		.catch((err) => {
			console.log(err);
		});
});
