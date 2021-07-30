let host = window.location.host;
let hostName = host.split(':');
const baseUrl = `${window.location.protocol}//${hostName[0]}`;
console.log(baseUrl);

export const environment = {
  production: true,
  serverUrl: 'http://65.0.146.153:5000',
  envName: 'PROD',
  API_URL: 'assets/api',
  clientUrl: `${baseUrl}`
};
