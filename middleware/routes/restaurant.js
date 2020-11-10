module.exports = (app, env, rp) => {
  const requestCustom = require('../utils/request')
  const serverRoutes = require('../utils/serverRoutes')
  /**
   * Vendor Profile.
   */
  app.get('/api/profile', (req, res) => {
    let requestBody = { ...req.query }
    requestBody.access_token = req.session.user && req.session.user.access_token
    var options = {
      method: 'GET',
      uri: `${serverRoutes.vendorProfile}`,
      json: true,
      qs: requestBody,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    rp(options)
      .then(function (parsedBody) {
        let responseBody = { ...parsedBody }
        req.session.vendorProfile = parsedBody.details
        req.session.save()
        res.status(200).json(responseBody)
      })
      .catch(function (err) {
        res.status(500).json(err)
      })
  })

  /**
   * Vendor Restaurants.
   */
  app.get('/api/restaurants/list', (req, res) => {
    let requestBody = { ...req.query };
    requestBody.vendor =
      req.session.vendorProfile && req.session.vendorProfile.id;
    requestBody.access_token = req.session.user && req.session.user.access_token;
    var options = {
      method: 'GET',
      uri: `${serverRoutes.restaurantsList}`,
      json: true,
      qs: requestBody,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    rp(options)
      .then(function (parsedBody) {
        let responseBody = { ...parsedBody }
        req.session.restaurant = parsedBody.items[0]
        req.session.save()
        res.status(200).json(responseBody)
      })
      .catch(function (err) {
        res.status(500).json(err)
      })
  })

  /**
   * Set Restaurant info in session.
   */
  app.post('/api/setRestaurantInfo', (req, res) => {
    let requestBody = { ...req.body }
    req.session.restaurant = requestBody
    req.session.save()
    if (req.session.restaurant) {
      res.status(200).json({
        details: req.session.restaurant,
        message: 'Restaurant retrived successfully'
      })
    } else {
      res
        .status(500)
        .json({ error: { message: 'Failed to set the restaurant' } })
    }
  })

  /**
   * Set Restaurant Id in session.
   */
  app.get('/api/getRestaurantInfo', (req, res) => {
    try {
      const restaurant = req.session.restaurant
      if (restaurant) {
        res.status(200).json({
          details: restaurant,
          message: 'Restaurant retrived successfully'
        })
      } else {
        throw new Error('Restaurant does not available for this vendor.')
      }
    } catch (e) {
      res.status(500).json({
        error: { message: 'Restaurant does not available for this vendor' }
      })
    }
  })

  // /**
  //  * Vendor Hoppoints.
  //  */
  // app.get('/api/hoppoints/viewSummary', (req, res) => {
  //   let requestBody = { ...req.query }
  //   requestBody.id = req.session.restaurant.id
  //   requestCustom.get(serverRoutes.hopPointsSummary, req, res, requestBody)
  // })

  /**
   * Walk in stats.
   */
  app.get('/api/dashboard/walkInStats', (req, res) => {
    let requestBody = { ...req.query }
    vendorRestaurantId = req.session.restaurant.id
    requestCustom.get(
      `${serverRoutes.dashboardWalkInStats}/${vendorRestaurantId}`,
      req,
      res,
      requestBody
    )
  })

  /**
   * Revenue.
   */
  app.get('/api/dashboard/revenueStats', (req, res) => {
    let requestBody = { ...req.query }
    vendorRestaurantId = req.session.restaurant.id
    requestCustom.get(
      `${serverRoutes.dashboardRevenueStats}/${vendorRestaurantId}`,
      req,
      res,
      requestBody
    )
  })

  /**
   * Gender stats.
   */
  app.get('/api/dashboard/genderStats', (req, res) => {
    let requestBody = { ...req.query }
    vendorRestaurantId = req.session.restaurant.id
    requestCustom.get(
      `${serverRoutes.dashboardGenderStats}/${vendorRestaurantId}`,
      req,
      res,
      requestBody
    )
  })

  /**
   * Age group stats.
   */
  app.get('/api/dashboard/ageGroupStats', (req, res) => {
    let requestBody = { ...req.query }
    vendorRestaurantId = req.session.restaurant.id
    requestCustom.get(
      `${serverRoutes.dashboardAgeGroupStats}/${vendorRestaurantId}`,
      req,
      res,
      requestBody
    )
  })

  /**
   * Session stats.
   */
  app.get('/api/dashboard/sessionStats', (req, res) => {
    let requestBody = { ...req.query }
    vendorRestaurantId = req.session.restaurant.id
    requestCustom.get(
      `${serverRoutes.dashboardSessionStats}/${vendorRestaurantId}`,
      req,
      res,
      requestBody
    )
  })

  /**
   * Restaurant Menus.
   */
  app.get('/api/restaurants/menus', (req, res) => {
    let requestBody = { ...req.query }
    requestBody.restaurant = req.session.restaurant.id
    requestCustom.get(`${serverRoutes.restaurantMenus}`, req, res, requestBody)
  })

  /**
   * Update Restaurant Menus.
   */
  app.post('/api/restaurants/updateTopMenus', (req, res) => {
    let requestBody = { ...req.body }
    requestBody.id = req.session.restaurant.id
    requestCustom.post(
      `${serverRoutes.updateTopMenus}/${requestBody.id}`,
      req,
      res,
      requestBody
    )
  })

  /**
   * Update Restaurant Menus.
   */
  app.post('/api/restaurants/updateTopMenuSlots', (req, res) => {
    let requestBody = { ...req.body }
    requestBody.id = req.session.restaurant.id
    requestCustom.post(
      `${serverRoutes.updateTopMenuSlots}/${requestBody.id}`,
      req,
      res,
      requestBody
    )
  })

  /**
   * Get Restaurant Orders.
   */
  app.get('/api/orders/list', (req, res) => {
    let requestBody = { ...req.query }
    requestBody.restaurant = req.session.restaurant.id;
    requestCustom.get(`${serverRoutes.orderList}`, req, res, requestBody)
  })
  app.get('/api/orders/view', (req, res) => {
    let requestBody = { ...req.query }
    requestBody.restaurant = req.session.restaurant.id;
    requestCustom.get(`${serverRoutes.ordersViewDetails}/${requestBody.id}`, req, res, requestBody)
  })

  app.post('/api/orders/change-status', (req, res) => {
    let requestBody = { ...req.body }
    let urlQuery = { ...req.query }
    requestCustom.post(
      `${serverRoutes.orderChangeStatus}/${urlQuery.id}`,
      req,
      res,
      requestBody
    )
  })

  app.get('/__getcookie', (req, res) => {
    // console.log('__getcookie')
    res.send('_sailsIoJSConnect();')
  })
}
