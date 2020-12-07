module.exports = (app, env, rp) => {
  const requestCustom = require("../utils/request");
  const serverRoutes = require("../utils/serverRoutes");

   /**
   * User crm for restaurant
   */
  app.get("/api/users/profile", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.userProfile}`, req, res, requestBody);
  });


};
