let host = window.location.host;
let hostName = host.split(':');
const baseUrl = `${window.location.protocol}//${hostName[0]}`;
const baseAdminUrl = `${window.location.protocol}//admin.${hostName[0]}`;
console.log(baseUrl);

export const environment = {
  production: true,
  serverUrl: `${baseUrl}:5002`,
  adminUrl: `${baseAdminUrl}`,
  envName: 'PROD',
  API_URL: 'assets/api',
  clientUrl: `${baseUrl}`
};
