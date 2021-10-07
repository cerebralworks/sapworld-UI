module.exports = (app, env, rp) => {
	const requestCustom = require('../utils/request')
	const serverRoutes = require('../utils/serverRoutes')

	/**
	* To get the industries details
	*/
	
	app.get('/api/industries/list', (req, res) => {
		let requestBody = { ...req.query }
		requestCustom.get(serverRoutes.listIndustries, req, res, requestBody)
	})
  
	//Industry post
	app.post("/api/industries/create",(req, res) => {
		let requestBody = { ...req.body };    
		requestCustom.post(`${serverRoutes.industriesCreate}`, req, res, requestBody);
	})
	
	//Industry delete
	app.delete("/api/industries/delete/:id",(req, res) => {
		let requestBody = req.params.id ;   
		requestCustom.post(`${serverRoutes.industriesDelete}/${requestBody}`, req, res, requestBody);
	})
	
	//Industry update
	app.post("/api/industries/update/:id",(req, res) => {
		let requestBody = { ...req.body } ;   
		requestCustom.post(`${serverRoutes.industriesUpdate}/${requestBody.id}`, req, res, requestBody);
	})
	
	/**
	* Vendor Hoppoints.
	*/
	app.get('/api/hoppoints/transactions', (req, res) => {
		let requestBody = { ...req.query }
		requestBody.id = req.session.restaurant.id;
		requestCustom.get(serverRoutes.hopPointsTransactions, req, res, requestBody)
	})

}
