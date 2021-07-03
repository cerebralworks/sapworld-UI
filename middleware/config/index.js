require("dotenv").config();
const convict = require("convict");

const config = convict({
  NODE_ENV: {
    format: ["production", "development", "test", "local", "stage"],
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
});

config.validate({ allowed: "strict" });

module.exports = config.getProperties();
