// export const environment = {
//   production: true,
//   appVersion: 'v717demo1',
//   USERDATA_KEY: 'authf649fc9a5f55',
//   isMockEnabled: true,
//   apiUrl: 'api'
//   // apiUrl: 'mysite.com/api'
// };

let host = window.location.host;
let hostName = host.split(':');
const baseUrl = `${window.location.protocol}//${hostName[0]}`;
console.log(baseUrl);

export const environment = {
  production: true,
  serverUrl: 'http://149.56.180.254:5000',
  subPath: '/admin',
  envName: 'PROD',
  API_URL: 'assets/api',
  clientUrl: `${baseUrl}`,
  adminUrl: 'http://149.56.180.254/admin',
  app_url: 'http://149.56.180.254/',
  apiPath: 'http://149.56.180.254:5000',
  appVersion: 'v717demo1',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'api'
};
