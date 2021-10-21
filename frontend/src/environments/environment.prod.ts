let host = window.location.host;
let hostName = host.split(':');
const baseUrl = `${window.location.protocol}//${hostName[0]}`;
console.log(baseUrl);

export const environment = {
  production: true,
  serverUrl: 'http://52.204.92.226:5002',
  adminUrl: 'http://184.72.227.41',
  envName: 'PROD',
  API_URL: 'assets/api',
  clientUrl: `${baseUrl}`
};
