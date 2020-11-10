const routes = {
    login: '/oauth/token',
    vendorProfile: '/vendors/profile',
    restaurantsList: '/restaurants/list',
    hopPointsSummary: '/hoppoints/view-summary',
    dashboardWalkInStats: '/dashboard/walk-in-stats',
    dashboardRevenueStats: '/dashboard/revenue-stats',
    dashboardGenderStats: '/dashboard/gender-stats',
    dashboardSessionStats: '/dashboard/session-stats',
    dashboardAgeGroupStats: '/dashboard/age-group-stats',
    restaurantMenus: '/restaurants/menus',
    updateTopMenus: '/restaurants/update-top-menus',
    updateTopMenuSlots: '/restaurants/update-top-menu-slots',
    CRM: '/users/crm',
    sendNotification: '/users/send-notifications',
    orderList: '/orders/list',
    ordersViewDetails: '/orders/view',
    orderChangeStatus: '/orders/change-status',
    usersVisits: '/users/visits',
    usersVewDetails: '/users/view',
    hopPointsTransactions: '/hoppoints/transactions'
}

module.exports = routes;
