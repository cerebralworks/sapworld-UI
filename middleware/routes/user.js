module.exports = (app, env, rp) => {
  const requestCustom = require("../utils/request");
  const serverRoutes = require("../utils/serverRoutes");
  const IncomingForm = require("formidable").IncomingForm;
  const fs = require("fs");

   /**
   * User crm for restaurant
   */
  app.get("/api/users/profile", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.userProfile}`, req, res, requestBody);
  });

  /**
   * User crm for restaurant
   */
  app.get("/api/users/list", (req, res) => {
    let requestBody = { ...req.query };   
    requestCustom.get(`${serverRoutes.userList}`, req, res, requestBody);
  });

  app.post("/api/users/update", (req, res) => {
    let requestBody = { ...req.body };    
    requestCustom.post(`${serverRoutes.userUpdate}`, req, res, requestBody);
  });

  app.get("/api/users/view", (req, res) => {
    let requestBody = { ...req.query };   
    const userID = requestBody.id; 
    requestCustom.get(`${serverRoutes.userView}/${userID}`, req, res, requestBody);
  });

  

  app.post("/api/users/update-photo", (req, res) => {
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

  

};
