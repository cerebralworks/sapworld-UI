module.exports = (app, env, rp) => {
  const requestCustom = require("../utils/request");
  const serverRoutes = require("../utils/serverRoutes");
  const IncomingForm = require("formidable").IncomingForm;
  const fs = require("fs");
  
	/**
	* Admin Dashboard details GET
	*/
	app.get("/api/admin/dashboard", (req, res) => {
		let requestBody = { ...req.query };    
		requestCustom.get(`${serverRoutes.adminDashboardCount}`, req, res, requestBody);
	});
	
	
  app.get("/api/admins/profile", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.adminProfile}`, req, res, requestBody);
  });
/**
   * Admin Profile Posting
   */
  app.post("/api/admins/create", (req, res) => {
    let requestBody = { ...req.body };    
    requestCustom.post(`${serverRoutes.adminsCreate}`, req, res, requestBody);
  });
  
  app.post("/api/admins/update-photo", (req, res) => {
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
        uri: `${serverRoutes.adminPhotoUpdate}?access_token=${access_token}`,
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
  
	/**
	* Admin Dashboard details GET
	*/
	app.post("/api/admin/dashboard/details", (req, res) => {
		let requestBody = { ...req.body };  
		requestCustom.post(`${serverRoutes.adminDashboardDetails}`, req, res, requestBody);
	});
	/**
	* Admin Dashboard details GET
	*/
	app.post("/api/admin/employeers/details", (req, res) => {
		let requestBody = { ...req.body };  
		requestCustom.post(`${serverRoutes.adminDashboardEmployeeDetails}`, req, res, requestBody);
	});
	/**
	* Admin Dashboard details GET
	*/
	app.post("/api/admin/users/details", (req, res) => {
		let requestBody = { ...req.body };  
		requestCustom.post(`${serverRoutes.adminDashboardUserDetails}`, req, res, requestBody);
	});
	
	
	app.post("/api/skill-tags/data",(req, res) => {
		let requestBody = { ...req.body };    
		requestCustom.post(`${serverRoutes.skillData}`, req, res, requestBody);
	})
	
	app.get("/api/skill-tags/find", (req, res) => {
		let requestBody = { ...req.query };    
		requestCustom.get(`${serverRoutes.skillTagFind}`, req, res, requestBody);
	});
	/**
	* Skills details POST
	*/
	app.post("/api/skill-tags/creates",(req, res) => {
		let requestBody = { ...req.body };    
		requestCustom.post(`${serverRoutes.skillTagCreates}`, req, res, requestBody);
	})
	//Skills Delete
	app.delete("/api/skill-tags/delete/:id",(req, res) => {
		let requestBody = req.params.id ;   
		requestCustom.post(`${serverRoutes.skillTagDelete}/${requestBody}`, req, res, requestBody);
	})
	//skill update
	app.post("/api/skill-tags/update/:id",(req, res) => {
		let requestBody = { ...req.body } ;   
		requestCustom.post(`${serverRoutes.skillTagUpdate}/${requestBody.id}`, req, res, requestBody);
	})
	
	
	//applicant details GET
	app.get("/api/jobpostings/applications/view/:id",(req, res) => {
		let requestBody = req.params.id ;   
		requestCustom.get(`${serverRoutes.applicationsGET}/${requestBody}`, req, res, requestBody);
	});
	
	//workauthorization GET
	app.get("/api/workauthorization/list", (req, res) => {
		let requestBody = { ...req.query };    
		requestCustom.get(`${serverRoutes.workauthorizationList}`, req, res, requestBody);
	});
	//workauthorization POST
	app.post("/api/workauthorization/create",(req, res) => {
		let requestBody = { ...req.body };    
		requestCustom.post(`${serverRoutes.workauthorizationCreate}`, req, res, requestBody);
	})
	//workauthorization delete
	app.delete("/api/workauthorization/delete/:id",(req, res) => {
		let requestBody = req.params.id ;   
		requestCustom.post(`${serverRoutes.workauthorizationDelete}/${requestBody}`, req, res, requestBody);
	})
	//workauthorization update
	app.post("/api/workauthorization/update/:id",(req, res) => {
		let requestBody = { ...req.body } ;   
		requestCustom.post(`${serverRoutes.workauthorizationUpdate}/${requestBody.id}`, req, res, requestBody);
	})
	
	//program GET
	app.get("/api/program/list", (req, res) => {
		let requestBody = { ...req.query };    
		requestCustom.get(`${serverRoutes.programList}`, req, res, requestBody);
	});
	//program POST
	app.post("/api/program/create",(req, res) => {
		let requestBody = { ...req.body };    
		requestCustom.post(`${serverRoutes.programCreate}`, req, res, requestBody);
	})
	//program delete
	app.delete("/api/program/delete/:id",(req, res) => {
		let requestBody = req.params.id ;   
		requestCustom.post(`${serverRoutes.programDelete}/${requestBody}`, req, res, requestBody);
	})
	//program update
	app.post("/api/program/update/:id",(req, res) => {
		let requestBody = { ...req.body } ;   
		requestCustom.post(`${serverRoutes.programUpdate}/${requestBody.id}`, req, res, requestBody);
	})
	
	
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
  
  app.get("/api/country/list", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.countryList}`, req, res, requestBody);
  });
  app.get("/api/language/list", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.languageList}`, req, res, requestBody);
  });

  app.get("/api/employers/list", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.employerList}`, req, res, requestBody);
  });

	/**
	* Program details GET
	*/
	app.get("/api/program/list", (req, res) => {
		let requestBody = { ...req.query };    
		requestCustom.get(`${serverRoutes.programList}`, req, res, requestBody);
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
  app.post("/api/employers/employers-dashboard", (req, res) => {
    let requestBody = { ...req.body };    
    requestCustom.post(`${serverRoutes.employerDashboard}`, req, res, requestBody);
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
   * Job Listed Count
   */
  app.get("/api/jobpostings/list/users/count", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.jobPostingListCount}`, req, res, requestBody);
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
/**
   * Employee Profile Posting
   */
  app.post("/api/employers/update", (req, res) => {
    let requestBody = { ...req.body };    
    requestCustom.post(`${serverRoutes.employersUpdate}`, req, res, requestBody);
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
