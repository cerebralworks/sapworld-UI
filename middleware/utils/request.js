const env = require("../config");
  const fs = require("fs");
const { SERVICE_API_URL, PORT, NODE_ENV } = env;
var rp = require("request-promise-native").defaults({
  baseUrl: SERVICE_API_URL
});

const requests = {
	
	/**
	**	To pass the delete request with the params
	**	and return the success or failed response
	**/
	delete: (url, req, res) => {
		var options = {
		  method: 'DELETE',
		  uri: `${url}`,
		  json: true,
		  body: req.body,
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		  }
		}
		rp(options)
		  .then(function (parsedBody) {
			res.status(200).json(parsedBody)
		  })
		  .catch(function (err) {
			res.status(500).json(err)
		  })
	},
  
	/**
	**	To pass the get request 
	**	and return the success or failed response
	**/
	get: (url, req, res, body) => {
		let requestBody = {...body};
		requestBody.access_token = req.session.user && req.session.user.access_token;
		var options = {
		  method: 'GET',
		  uri: `${url}`,
		  json: true,
		  qs: requestBody,
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		  }
		}
		
		rp(options)
		  .then(function (parsedBody) {
			res.status(200).json(parsedBody)
		  })
		  .catch(function (err) {
			res.status(500).json(err)
		  })
	},
	
	/**
	**	To pass the put request with the params
	**	and return the success or failed response
	**/
	put: (url, req, res) => {
		var options = {
		  method: 'PUT',
		  uri: `${url}`,
		  json: true,
		  body: req.body,
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		  }
		}

		rp(options)
		  .then(function (parsedBody) {
			res.status(200).json(parsedBody)
		  })
		  .catch(function (err) {
			res.status(500).json(err)
		  })
	},
	
	/**
	**	To pass the post request with the params
	**	and return the success or failed response
	**/
	post: (url, req, res, body = {}, message = "") => {
		let requestBody = {...body };
		let access_token = req.session.user && req.session.user.access_token;
		var options = {
		  method: 'POST',
		  uri: `${url}?access_token=${access_token}`,
		  json: true,
		  body: requestBody,
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		  }
		}

		rp(options)
		  .then(function (parsedBody) {
			let responseBody = { ...parsedBody };
			responseBody.success = true;
			if (message) {
			  responseBody.message = message;
			}
			res.status(200).json(responseBody)
		  })
		  .catch(function (err) {
			let responseBody = { ...err };
			responseBody.success = false;
			res.status(500).json(responseBody)
		  })
	}
};



module.exports = requests;