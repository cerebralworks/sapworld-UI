module.exports = (app, env, rp) => {
  const requestCustom = require("../utils/request");
  const serverRoutes = require("../utils/serverRoutes");

   /**
   * User crm for restaurant
   */
  app.get("/api/users/CRM", (req, res) => {
    let requestBody = { ...req.query };    
    requestBody.restaurant = req.session.restaurant.id;
    requestCustom.get(`${serverRoutes.CRM}`, req, res, requestBody);
  });

   /**
   * Send notification
   */
  app.post("/api/users/sendNotification", (req, res) => {
    let requestBody = { ...req.body };
    requestBody.sender_type = 1;
    requestBody.push = true;
    requestBody.data = {restaurant : req.session.restaurant.id};
    requestCustom.post(`${serverRoutes.sendNotification}`, req, res, requestBody);
  });

  /**
   * Get Restaurant Visits.
   */
  app.get("/api/users/visits", (req, res) => {    
    let requestBody = { ...req.query };
    requestCustom.get(`${serverRoutes.usersVisits}`, req, res, requestBody);
  });

   /**
   * Get Restaurant Info.
   */
  app.get("/api/users/view", (req, res) => {    
    let urlQuery = { ...req.query };
    requestCustom.get(`${serverRoutes.usersVewDetails}/${urlQuery.id}`, req, res, urlQuery);
  });

};
