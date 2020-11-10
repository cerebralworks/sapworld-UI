module.exports = (app, env, rp) => {
  const requestCustom = require("../utils/request");
  const serverRoutes = require("../utils/serverRoutes");

  // Check route is connected
  app.get("/", (req, res) => {
    res.status(200).json({ message: "SAPWORLD Middleware Connected!" });
  });

  /**
   * Check if user is logged in.
   */
  app.post("/api/isLoggedIn", (req, res) => {
    // req.session.destroy(function (err) {});
    let responseData = {};
    responseData.success = req.session.isLoggedIn
      ? req.session.isLoggedIn
      : false;
    responseData.isLoggedIn = req.session.isLoggedIn
      ? req.session.isLoggedIn
      : false;
      responseData.accessToken = req.session.user && req.session.user.access_token;
    res.json(responseData);
  });

  /**
   * User is log in.
   */
  app.post("/api/login", (req, res) => {
    let requestBody = { ...req.body };
    (requestBody.grant_type = "password"),
      (requestBody.client_id = env.CLIENT_ID),
      (requestBody.client_secret = env.CLIENT_SECRET);
    var options = {
      method: "POST",
      uri: `${serverRoutes.login}`,
      json: true,
      body: requestBody,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };

    rp(options)
      .then(function(parsedBody) {
        let responseBody = { ...parsedBody };
        req.session.isLoggedIn = true;
        req.session.user = parsedBody;
        let date = new Date();
        let current_time = date.getTime();
        req.session.expires_in = current_time + responseBody.expires_in * 1000;
        req.session.save();
        responseBody = {};
        responseBody.isLoggedIn = req.session.isLoggedIn
          ? req.session.isLoggedIn
          : false;
        responseBody.role = parsedBody.types;
        responseBody.message = "Login Successfull";
        res.status(200).json(responseBody);
      })
      .catch(function(err) {
        res.status(500).json(err);
      });
  });

  /**
   * User is log out.
   */
  app.post("/api/logout", (req, res) => {
    req.session.destroy(function(err) {
      if (err) {
        res.status(500).json(err);
      } else {
        let responseData = {};
        responseData.isLoggedIn = false;
        responseData.success = true;
        responseData.message = "Logged out successfully!";
        res.status(200).json(responseData);
      }
    });
  });
};
