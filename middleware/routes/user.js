module.exports = (app, env, rp) => {
	const requestCustom = require("../utils/request");
	const serverRoutes = require("../utils/serverRoutes");
	const IncomingForm = require("formidable").IncomingForm;
	const fs = require("fs");
  

	/**
	* To get the notification count details
	*/
	app.post("/api/notification/count", (req, res) => {
		let requestBody = { ...req.body };     
		requestCustom.post(`${serverRoutes.notification}`, req, res, requestBody);
	});
  
	/**
	* To get the notification details
	*/
	
	app.post("/api/notification/details", (req, res) => {
		let requestBody = { ...req.body };   
		requestCustom.post(`${serverRoutes.notificationDetails}`, req, res, requestBody);
	});
  
	/**
	* To save the log data
	*/
	
	app.post("/api/logs", (req, res) => {
		let requestBody = JSON.stringify(req.body);  
		fs.appendFileSync("./logs/logs.json",requestBody);
		res.status(200).json('saved');
	});
  
	/**
	* To get the user profile
	*/
   
	app.get("/api/users/profile", (req, res) => {
		let requestBody = { ...req.query };    
		requestCustom.get(`${serverRoutes.userProfile}`, req, res, requestBody);
	});
  
	/**
	* To get the users profile
	*/
	
	app.post("/api/users/user-dashboard", (req, res) => {
		let requestBody = { ...req.body };    
		requestCustom.post(`${serverRoutes.userDashboard}`, req, res, requestBody);
	});

	/**
	* To get the users list
	*/
	
	app.get("/api/users/list", (req, res) => {
		let requestBody = { ...req.query };   
		requestCustom.get(`${serverRoutes.userList}`, req, res, requestBody);
	});
	
	/**
	**	To update the user ptofile information
	**/
	
	app.post("/api/users/update", (req, res) => {
		let requestBody = { ...req.body };    
		requestCustom.post(`${serverRoutes.userUpdate}`, req, res, requestBody);
		//let requestBodys = JSON.stringify(res.body);  
		//fs.appendFileSync("./logs/logs.json",requestBodys);
	});
	
	/**
	**	To get the user details 
	**/
	
	app.get("/api/users/view", (req, res) => {
		let requestBody = { ...req.query };   
		const userID = requestBody.id; 
		requestCustom.get(`${serverRoutes.userView}/${userID}`, req, res, requestBody);
	});

	/**
	**	To update the user profile image
	**/
	
	app.post("/api/users/update-photo", (req, res) => {
		var form = new IncomingForm();
		form.parse(req, function(err, fields, files) {
			var formData = fields;
			if (files.photo) {
				const uploadedFile = files.photo[0]; // Assuming doc_resume is an array
				const fileReadStream = fs.createReadStream(uploadedFile.filepath);
				formData.photo = {
					value: fileReadStream,
					options: {
						filename: uploadedFile.originalFilename,
						contentType: uploadedFile.mimetype,
					},
				};
			}
			let access_token = req.session.user && req.session.user.access_token;
			var options = {
				method: "POST",
				uri: `${serverRoutes.userPhotoUpdate}?access_token=${access_token}`,
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
	**	To update the resume
	**/
	
	app.post("/api/users/update-doc-resume", (req, res) => {
		var form = new IncomingForm();
		form.parse(req, function(err, fields, files) {
			var formData = fields;
			if (files.doc_resume) {
				const uploadedFile = files.doc_resume[0]; // Assuming doc_resume is an array
				const fileReadStream = fs.createReadStream(uploadedFile.filepath);
				formData.doc_resume = {
					value: fileReadStream,
					options: {
						filename: uploadedFile.originalFilename,
						contentType: uploadedFile.mimetype,
					},
				};
			}
			let access_token = req.session.user && req.session.user.access_token;
			var options = {
				method: "POST",
				uri: `${serverRoutes.userResumeUpdate}?access_token=${access_token}`,
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
	**	To delete the resume
	**/
	
	app.post("/api/users/delete-resume", (req, res) => {
		var form = new IncomingForm();
		form.parse(req, function(err, fields, files) {
			var formData = fields;
			let access_token = req.session.user && req.session.user.access_token;
			var options = {
				method: "POST",
				uri: `${serverRoutes.userResumeDelete}?access_token=${access_token}`,
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
	**	To update the user document
	**/
	
	app.post("/api/users/update-doc-cover", (req, res) => {
		var form = new IncomingForm();
		form.parse(req, function(err, fields, files) {
			var formData = fields;
			if (files.doc_cover) {		
				const uploadedFile = files.doc_cover[0]; // Assuming doc_resume is an array
				const fileReadStream = fs.createReadStream(uploadedFile.filepath);
				formData.doc_cover = {
					value: fileReadStream,
					options: {
						filename: uploadedFile.originalFilename,
						contentType: uploadedFile.mimetype,
					},
				};
			}
			let access_token = req.session.user && req.session.user.access_token;
			var options = {
				method: "POST",
				uri: `${serverRoutes.userCoverUpdate}?access_token=${access_token}`,
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
	**	To delete the users cover letter
	**/
	
	app.post("/api/users/delete-cover", (req, res) => {
		var form = new IncomingForm();
		form.parse(req, function(err, fields, files) {
			var formData = fields;
			let access_token = req.session.user && req.session.user.access_token;
			var options = {
				method: "POST",
				uri: `${serverRoutes.userCoverDelete}?access_token=${access_token}`,
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
	**	To Select the default-resume
	**/
	
	app.post("/api/users/choose-default-resume", (req, res) => {
		var form = new IncomingForm();
		form.parse(req, function(err, fields, files) {
			var formData = fields;
			let access_token = req.session.user && req.session.user.access_token;
			var options = {
				method: "POST",
				uri: `${serverRoutes.userChooseDefaultResume}?access_token=${access_token}`,
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
	**	To apply for the new job
	**/
	
	app.post("/api/jobpostings/apply", (req, res) => {
		let requestBody = { ...req.body };    
		requestCustom.post(`${serverRoutes.jobApply}`, req, res, requestBody);
	});
	
	/**
	**	To get the applicant details
	**/
	
	app.get("/api/jobpostings/applications/list-for-user", (req, res) => {
		let requestBody = { ...req.query };   
		requestCustom.get(`${serverRoutes.applicationsListForUser}`, req, res, requestBody);
	});
	
	/**
	**	To get the user-scoring details
	**/
	
	app.post("/api/jobpostings/user-scoring", (req, res) => {
		let requestBody = { ...req.body };   
		requestCustom.get(`${serverRoutes.userScoring}`, req, res, requestBody);
	});
	
	/**
	**	To delete the applicant
	**/
	
    app.post("/api/user/application/delete", (req, res) => {
		let requestBody = { ...req.body };    
		console.log(requestBody.id);
		requestCustom.post(`${serverRoutes.applicationDelete}/${requestBody.id}`, req, res, requestBody);
	});

};
