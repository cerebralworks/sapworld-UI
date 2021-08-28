const env = require("../config");
  const fs = require("fs");
const { SERVICE_API_URL, PORT, NODE_ENV } = env;
var rp = require("request-promise-native").defaults({
  baseUrl: SERVICE_API_URL
});

const requests = {
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
		let requestBodys = JSON.stringify(err);  
		fs.appendFileSync("./logs/logs.json",requestBodys);
        res.status(500).json(err)
      })
  },
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
		let requestBodys = JSON.stringify(responseBody);  
		res.status(200).json(requestBodys)
      })
      .catch(function (err) {
        let responseBody = { ...err };
        responseBody.success = false;
		let requestBodys = JSON.stringify(responseBody);  
		fs.appendFileSync("./logs/logs.json",requestBodys);
        res.status(500).json(responseBody)
      })
  }
};


module.exports = requests;