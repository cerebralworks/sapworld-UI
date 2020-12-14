const routes = {
    login: '/oauth/token',
    employerSignup: '/employers/signup',
    userSignup: '/users/signup',
    accountVerify: '/accounts/verify',
    listIndustries: '/industries/list',
    employerProfile: '/employers/profile',
    userProfile: '/users/profile',
    userUpdate: "/users/update",
    userPhotoUpdate: "/users/update-photo",
    jobPostingCreate: '/jobpostings/create',
    jobPostingUpdate: '/jobpostings/update',
    skillTagList: '/skill-tags/list',
    forgotPassword: '/accounts/request-reset-password',
    jobPostingList: '/jobpostings/list',
    resetPassword: '/accounts/reset-password',
    jobDelete: '/jobpostings/delete',
    jobPostingView: '/jobpostings/view',
}

module.exports = routes;
