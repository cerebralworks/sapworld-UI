module.exports = (app, env, rp) => {
  const requestCustom = require("../utils/request");
  const serverRoutes = require("../utils/serverRoutes");

   /**
   * User crm for restaurant
   */
  app.get("/api/employers/profile", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.employerProfile}`, req, res, requestBody);
  });

  app.get("/api/skill-tags/list", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.skillTagList}`, req, res, requestBody);
  });

   /**
   * Job Posting
   */
  app.post("/api/jobpostings/create", (req, res) => {
    let requestBody = { ...req.body };    
    requestCustom.post(`${serverRoutes.jobPostingCreate}`, req, res, requestBody);
  });

};
