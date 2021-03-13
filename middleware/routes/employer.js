module.exports = (app, env, rp) => {
  const requestCustom = require("../utils/request");
  const serverRoutes = require("../utils/serverRoutes");
  const IncomingForm = require("formidable").IncomingForm;
  const fs = require("fs");
  
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

  app.get("/api/employers/list", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.employerList}`, req, res, requestBody);
  });

   /**
   * Job Posting
   */
  app.post("/api/jobpostings/create", (req, res) => {
    let requestBody = { ...req.body };    
    requestCustom.post(`${serverRoutes.jobPostingCreate}`, req, res, requestBody);
  });

   /**
   * Change Job Status
   */
  app.post("/api/jobpostings/change-status", (req, res) => {
    let requestBody = { ...req.body };
    requestCustom.post(`${serverRoutes.changeJobStatus}/${requestBody.id}`, req, res, requestBody);
  });

  /**
   * Change Employer Status
   */
   app.post("/api/employers/change-status", (req, res) => {
    let requestBody = { ...req.body };
    requestCustom.post(`${serverRoutes.changeEmployerStatus}/${requestBody.id}`, req, res, requestBody);
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

  app.get("/api/employers/company-profile", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.employerCompanyProfile}`, req, res, requestBody);
  });

  app.get("/api/employers/view", (req, res) => {
    let requestBody = { ...req.query };  
    const employerID = requestBody.id;
    if(employerID) {
      requestCustom.get(`${serverRoutes.employerProfileView}/${employerID}`, req, res, requestBody);
    }
  });

  app.post("/api/jobpostings/applications/short-list-user", (req, res) => {
    let requestBody = { ...req.body };    
    requestCustom.post(`${serverRoutes.shortListUser}`, req, res, requestBody);
  });

  app.post("/api/employers/save-profile", (req, res) => {
    let requestBody = { ...req.body };    
    requestCustom.post(`${serverRoutes.saveProfile}`, req, res, requestBody);
  });

  app.get("/api/employers/saved-profiles", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.savedProfiles}`, req, res, requestBody);
  });

  app.post("/api/employers/update-photo", (req, res) => {
    var form = new IncomingForm();
    form.parse(req, function(err, fields, files) {
      var formData = fields;
      if (files.photo) {
        formData.photo = {
          value: fs.createReadStream(files.photo.path),
          options: {
            filename: files.photo.name,
            contentType: files.photo.type,
          },
        };
      }
      let access_token = req.session.user && req.session.user.access_token;
      var options = {
        method: "POST",
        uri: `${serverRoutes.employerPhotoUpdate}?access_token=${access_token}`,
        formData: formData
      };
      rp(options)
        .then(function(parsedBody) {
          let responseData = JSON.parse(parsedBody);
          res.status(200).json(responseData);
        })
        .catch(function(err) {
          res.status(500).json({ err: err });
        });
    });
  });

};
