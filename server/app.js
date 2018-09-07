	const Pusher = require('pusher');
	const express = require('express');
	const bodyParser = require('body-parser');
	const cors = require('cors');
	const app = express();
	app.use(cors());
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());

	var pusher = new Pusher({
		appId: '594216',
		key: 'fe9008fc9f09d31506c0',
		secret: 'ceabeae5febb8b6752cf',
		cluster: 'ap1',
		encrypted: true
	});
	app.set('PORT', process.env.PORT || 9999);
	app.post('/message', (req, res) => {
	  const message = req.body;
	  pusher.trigger('chat', 'message', message);
	  res.send(message)
	});
	app.listen(app.get('PORT'), () => 
	console.log('Listening at ' + app.get('PORT')))