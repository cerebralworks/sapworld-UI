const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const fs = require("fs");
const errorHandler = require("errorhandler");
var cookieParser = require("cookie-parser");
const session = require("express-session");
const redis = require("redis");
const redisClient = redis.createClient();
const redisStore = require("connect-redis")(session);
const https = require("https");
const http = require("http");
const routes = require("./routes");
const serverRoutes = require("./utils/serverRoutes");

// Environment variable configuration
const env = require("./config");
const { SERVICE_API_URL, PORT, NODE_ENV } = env;

// Bind default base url to every http request.
var rp = require("request-promise-native").defaults({
  baseUrl: SERVICE_API_URL,
});

// Defining the Express app
const app = express();

// Server implementation
let server;
if (
  fs.existsSync("/sslcert/private.key") &&
  fs.existsSync("/sslcert/a0b1d880eaa433e4.pem") &&
  fs.existsSync("/sslcert/gd_bundle-g2-g1.crt")
) {
  // https implementation
  const options = {
    key: fs.readFileSync("/sslcert/private.key", "utf8"),
    cert: fs.readFileSync("/sslcert/a0b1d880eaa433e4.pem", "utf8"),
    ca: [fs.readFileSync("/sslcert/gd_bundle-g2-g1.crt", "utf8")],
  };
  server = https.createServer(options, app);
} else {
  // http implementation
  server = http.createServer(app);
}

// Adding Helmet to enhance your API's security
app.use(helmet());

// Provides middleware for parsing of cookies
app.use(cookieParser("sapWorldRedisSession"));

// Using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var whitelist = ['http://184.72.227.41', 'http://52.204.92.226'];
// Enabling CORS for all requests
app.use(
  require("cors")({
    origin: function(origin, callback) {
      callback(null, true);
	 
	 /* if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    } */
	
    },
    credentials: true,
  })
);

redisClient.on("error", err => {
  // console.log("Redis error: ", err);
});

// Adding session to store values. We are using redis session. We need to check redis active on our system.
app.use(
  session({
    secret: "sapWorldRedisSession",
    name: "sapWorldRedis",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Note that the cookie-parser module is no longer needed
    store: new redisStore({
      host: "localhost",
      port: 6379,
      client: redisClient,
      ttl: 3600,
    }),
  })
);

app.use(function(req, res, next) {
  if (!req.session) {
    return next(new Error("oh no")); // handle error
  }
  next(); // otherwise continue
});

// Adding morgan to log HTTP requests
// app.use(morgan("combined"));

var isProduction = NODE_ENV === "production";

// Enable error handler for only development server.
//if (!isProduction) {
  app.use(errorHandler());
//}

app.use((req, res, next) => {
  if (req.session && req.session.isLoggedIn) {
    let date = new Date();
    let current_time = date.getTime();
    if (current_time >= (req.session.expires_in - 300000)) {
      var options = {
        method: "POST",
        uri: `${serverRoutes.login}`,
        json: true,
        body: {
          grant_type: "refresh_token",
          refresh_token: req.session.user.refresh_token,
          client_id: env.CLIENT_ID,
          client_secret: env.CLIENT_SECRET,
        },
      };
      rp(options)
        .then(function(parsedBody) {
          let responseBody = { ...parsedBody };
          req.session.isLoggedIn = true;
          req.session.user = parsedBody;
          req.session.expires_in =
            current_time + responseBody.expires_in * 1000;
          // console.log(
          //   "Ref expires_in",
          //   current_time + responseBody.expires_in * 1000
          // );

          req.session.save();
          responseBody = {};
          responseBody.isLoggedIn = req.session.isLoggedIn
            ? req.session.isLoggedIn
            : false;
          res.status(200).json(responseBody);
        })
        .catch(function(err) {
          if (err.response) {
            req.session.isLoggedIn = false;
            req.session.save();
            req.session.destroy();
            res.status(500).json(err);
          }
        });
    }
  }
  next();
});

// Defined routes
routes(app, env, rp);

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: !isProduction ? err : {},
    },
  });
});


server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
