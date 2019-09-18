# Email API demonstration

Microservices demo

There is an exposed api (POST /email) to send an email.  Under the hood, two different private microservices respond to email requests, each using a different email service for extra reliability.


## API
POST /email
```
{ 
	"to": [ "michaelmckavanagh@gmail.com" ], 
	"cc": "michaelmckavanagh@gmail.com", 
	"bcc": "michaelmckavanagh@gmail.com", 
	"subject": "hello world!!", 
	"from": "michaelmckavanagh@gmail.com", 
	"text": "What a wonderful world"
}
```


## Installation

Run the following commands:

```
git clone https://github.com/MichaelMcKavanagh/emailer.git
cd emailer
npm install
```

## Docker

For a single instance of each service you can just do:
```
docker-compose up
```

However, you can optionally scale up multiple email service instances.  Example below:
```
docker-compose up --scale email-mailgun-service=3 --scale email-sendinblue-service=3
```

Other useful commands:
```
docker-compose down
docker-compose build
```

## Testing

Run unit tests:
```
npm test
```

Run integration tests (These will only pass if the app is running locally, ie docker-compose up):
```
npm run test:integration
```


## Logging

Unified logging files (`error.log` and `combined.log`) are available within the logger service, but currently you'll have to exec into the service to see them.

## Localhost

Quick verification check (note, multiple calls will result in api returing some emails from companyA, and some from companyB):

```
http://localhost/email
```

# Author

Michael McKavanagh <michaelmckavanagh@gmail.com>
