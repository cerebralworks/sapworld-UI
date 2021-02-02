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

  /**
   * Job Updating
   */
  app.post("/api/jobpostings/update", (req, res) => {
    let requestBody = { ...req.body };    
    const jobID = requestBody.id;
    requestCustom.post(`${serverRoutes.jobPostingUpdate}/${jobID}`, req, res, requestBody);
  });


  /**
   * Job Listed
   */
  app.get("/api/jobpostings/list", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.jobPostingList}`, req, res, requestBody);
  });

   /**
   * Job Delete
   */
  app.post("/api/jobpostings/delete", (req, res) => {
    let requestBody = { ...req.body };    
    requestCustom.post(`${serverRoutes.jobDelete}`, req, res, requestBody);
  });

  /**
   * Job View
   */
  app.get("/api/jobpostings/view", (req, res) => {
    let requestBody = { ...req.query };  
    const jobID = requestBody.id;
    if(jobID) {
      requestCustom.get(`${serverRoutes.jobPostingView}/${jobID}`, req, res, requestBody);
    }
  });

  app.get("/api/jobpostings/job-scoring", (req, res) => {
    let requestBody = { ...req.query };   
    requestCustom.get(`${serverRoutes.userJobScoring}`, req, res, requestBody);
  });

  app.get("/api/jobpostings/applications/list", (req, res) => {
    let requestBody = { ...req.query };   
    requestCustom.get(`${serverRoutes.applicationsListForEmp}`, req, res, requestBody);
  });

  app.get("/api/jobpostings/send-email", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.sendMail}`, req, res, requestBody);
  });

  app.post("/api/employers/update-company-profile", (req, res) => {
    let requestBody = { ...req.body };    
    requestCustom.post(`${serverRoutes.updateCompanyProfile}`, req, res, requestBody);
  });

};
