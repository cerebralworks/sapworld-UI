const authentication = require("./authentication");
const restaurant = require("./restaurant");
const users = require("./users");
const hoppoints = require("./hoppoints");
var appRouter = (app, env, rp) => {
  authentication(app, env, rp);
  restaurant(app, env, rp);
  users(app, env, rp);
  hoppoints(app, env, rp);
};

module.exports = appRouter;
