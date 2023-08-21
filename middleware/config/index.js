require("dotenv").config();
const convict = require("convict");

/**
**	Loads the env data
**/

if(process.env.NODE_ENV=='production'){
	console.log(process.env.NODE_ENV);
	const config = convict({
		NODE_ENV: {
			format: ["production", "development", "test", "local", "staging"],
			default: "production",
			arg: "nodeEnv",
			env: "PRODUCTION_NODE_ENV"
		},
		PORT: {
			doc: "The port to bind.",
			format: "port",
			default: 5000,
			env: "PRODUCTION_PORT",
			arg: "port"
		},
		SERVICE_API_URL: {
			doc: "The IP address to bind.",
			format: "*",
			default: "localhost",
			env: "PRODUCTION_SERVICE_API_URL"
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
			env: "PRODUCTION_CLIENT_ID"
		},
		CLIENT_SECRET: {
			doc: "Secret used for session cookies and CSRF tokens",
			format: "*",
			default: "",
			sensitive: true,
			env: "PRODUCTION_CLIENT_SECRET"
		},
		CALENDLY_TOKEN: {
			doc: "Secret used for calendly authentication tokens",
			default: "",
			env: "PRODUCTION_CALENDLY_TOKEN"
		},
		ORGANIZATION_ID: {
			doc: "Secret used for calendly authentication id",
			default: "",
			env: "PRODUCTION_ORGANIZATION_ID"
		},
	});
	
	config.validate({ allowed: "strict" });

	module.exports = config.getProperties();
	
}else if(process.env.NODE_ENV=='staging'){
	console.log(process.env.NODE_ENV);
	const config = convict({
		NODE_ENV: {
			format: ["production", "development", "test", "local", "staging"],
			default: "staging",
			arg: "nodeEnv",
			env: "STAGE_NODE_ENV"
		},
		PORT: {
			doc: "The port to bind.",
			format: "port",
			default: 4001,
			env: "STAGE_PORT",
			arg: "port"
		},
		SERVICE_API_URL: {
			doc: "The IP address to bind.",
			format: "url",
			default: "localhost",
			env: "STAGE_SERVICE_API_URL"
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
			env: "STAGE_CLIENT_ID"
		},
		CLIENT_SECRET: {
			doc: "Secret used for session cookies and CSRF tokens",
			default: "",
			env: "STAGE_CLIENT_SECRET"
		},
		CALENDLY_TOKEN: {
			doc: "Secret used for calendly authentication tokens",
			default: "",
			env: "STAGE_CALENDLY_TOKEN"
		},
		ORGANIZATION_ID: {
			doc: "Secret used for calendly authentication id",
			default: "",
			env: "STAGE_ORGANIZATION_ID"
		},
	});
	
	config.validate({ allowed: "strict" });

	module.exports = config.getProperties();
	
}else{
	
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
	
}

