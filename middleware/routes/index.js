const authentication = require("./authentication");
const employer = require("./employer");
const user = require("./user");
const industries = require("./industries");
var appRouter = (app, env, rp) => {
  authentication(app, env, rp);
  employer(app, env, rp);
  user(app, env, rp);
  industries(app, env, rp);
};

module.exports = appRouter;
