require("dotenv").config();
const convict = require("convict");

const config = convict({
  NODE_ENV: {
    format: ["production", "development", "test", "local", "staging"],
    default: "development",
    arg: "nodeEnv",
    env: "NODE_ENV"
  },
  PORT: {
    doc: "The port to bind.",
    format: "port",
    default: 4001,
    env: "PORT",
    arg: "port"
  },
  SERVICE_API_URL: {
    doc: "The IP address to bind.",
    format: "url",
    default: "localhost",
    env: "SERVICE_API_URL"
  },
  SECRET: {
    doc: "Secret used for session cookies and CSRF tokens",
    format: "*",
    default: "",
    sensitive: true
  },
  CLIENT_ID: {
    doc: "Secret used for session cookies and CSRF tokens",
    format: "*",
    default: "",
    sensitive: true,
    env: "CLIENT_ID"
  },
  CLIENT_SECRET: {
    doc: "Secret used for session cookies and CSRF tokens",
    format: "*",
    default: "",
    sensitive: true,
    env: "CLIENT_SECRET"
  },
		CALENDLY_TOKEN: {
			doc: "Secret used for calendly authentication tokens",
			default: "",
			env: "CALENDLY_TOKEN"
		},
		ORGANIZATION_ID: {
			doc: "Secret used for calendly authentication id",
			default: "",
			env: "ORGANIZATION_ID"
		},
});

config.validate({ allowed: "strict" });

module.exports = config.getProperties();
