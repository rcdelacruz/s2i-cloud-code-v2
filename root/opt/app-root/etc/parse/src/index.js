/*
 *** NOTE: PLEASE DO NOT EDIT THIS FILE ***
 *
 */
require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const { default: ParseServer, ParseGraphQLServer } = require("parse-server");
const args = process.argv || [];
const test = args.some((arg) => arg.includes("jasmine"));

const config = require("./parse-config");
const databaseUri = process.env.DATABASE_URI;

if (!databaseUri) {
  console.log("DATABASE_URI not specified, falling back to localhost.");
}

const mountPath = process.env.PARSE_MOUNT || "/parse";
const port = process.env.PORT || 1337;

const app = express();
app.enable("trust proxy");
app.use(express.json());

if (!test) {
  /* New Relic setup */
  const newrelicParseServerName = process.env.NEWRELIC_PARSE_SERVER_NAME;
  const newrelicLicenseKey = process.env.NEWRELIC_LICENSE_KEY;
  if (newrelicLicenseKey && newrelicParseServerName) {
    // Tag the user request for analytics purposes
    const newrelic = require("newrelic");
    const instrumentedPath = new RegExp("^" + mountPath + "((?!/users/me).)*$");
    app.use(instrumentedPath, (req, res, next) => {
      const sessionToken =
        req.headers["x-parse-session-token"] || req.body["_SessionToken"];
      if (sessionToken) {
        const parseServerUrl =
          req.protocol + "://" + req.get("host") + mountPath;
        Parse.initialize(config.appId, config.javascriptKey, config.masterKey);
        Parse.serverURL = parseServerUrl;
        Parse.User.enableUnsafeCurrentUser();
        Parse.User.become(sessionToken, { useMasterKey: true }).then(
          (user) => {
            newrelic.addCustomAttribute("user_id", user.id);
            next();
          },
          (error) => {
            console.log(error);
            next();
          }
        );
      } else {
        next();
      }
    });
  }
}

app.use(cors());

// Serve static assets from the /public folder
app.use(express.static(path.join(__dirname, "/public")));

if (!test) {
  // Mount your cloud express app
  const api = new ParseServer(config);

  app.use("/", require("./cloud/main").express);
  // Serve the Parse API on the /parse URL prefix
  app.use(mountPath, api.app);
  const httpServer = require("http").createServer(app);
  httpServer.listen(port, () => {
    console.log(`REST API Running on http://localhost:${port}/parse`);
  });

  const parseGraphQLServer = new ParseGraphQLServer(api, {
    graphQLPath: "/graphql",
  });
  parseGraphQLServer.applyGraphQL(app);

  // This will enable the Live Query real-time server
  ParseServer.createLiveQueryServer(httpServer);
}

module.exports = {
  app,
  config,
};