let host = window.location.host;
let hostName = host.split(':');
const baseUrl = `${window.location.protocol}//${hostName[0]}`;
console.log(baseUrl);

export const environment = {
  production: true,
  calenderUrl: 'https://api.calendly.com/organizations/',
  membershipUrl: 'https://api.calendly.com/organization_memberships',
  eventUrl: 'https://api.calendly.com/event_types',
  serverUrl: 'http://65.0.146.153:5001',
  envName: 'PROD',
  API_URL: 'assets/api',
  clientUrl: `${baseUrl}`
};
