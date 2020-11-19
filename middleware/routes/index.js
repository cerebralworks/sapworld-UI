const authentication = require("./authentication");
const employer = require("./employer");
const users = require("./users");
const industries = require("./industries");
var appRouter = (app, env, rp) => {
  authentication(app, env, rp);
  employer(app, env, rp);
  users(app, env, rp);
  industries(app, env, rp);
};

module.exports = appRouter;
