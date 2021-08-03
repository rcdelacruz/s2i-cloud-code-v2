const FSFilesAdapter = require("@parse/fs-files-adapter");
module.exports = {
  databaseURI: process.env.DATABASE_URI || "mongodb://localhost:27017/dev",
  appId: process.env.APP_ID || "myAppId",
  clientKey: process.env.CLIENT_KEY || "myClientKey",
  masterKey: process.env.MASTER_KEY || "masterKey", //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || "http://localhost:1337/parse",
  javascriptKey: process.env.JAVASCRIPT_KEY || "myJSKey",
  restAPIKey: process.env.REST_API_KEY || "restAPIKey",
  cloud: process.env.PARSE_CLOUD_CODE || "./cloud/main.js",
  liveQuery: {
    classNames: process.env.LIVE_QUERY_CLASSNAMES
      ? process.env.LIVE_QUERY_CLASSNAMES.split(",")
      : [],
  },
  push:
    process.env.PUSH_ENABLED === "true"
      ? {
          android: {
            apiKey: process.env.ANDROID_API_KEY,
          },
          ios: {
            pfx: process.env.IOS_CERT_PATH,
            passphrase: process.env.IOS_PASSPHRASE || "",
            bundleId: process.env.IOS_BUNDLE_ID,
            production: process.env.IOS_PRODUCTION_MODE || false,
          },
        }
      : {},
  verbose: false,
  filesAdapter: {
    module: "@parse/s3-files-adapter",
    options: {
      bucket: process.env.S3_BUCKET_NAME,
      // optional:
      region: "us-west-2", // default value
      bucketPrefix: "", // default value
      directAccess: false, // default value
      fileAcl: null, // default value
      baseUrl: null, // default value
      baseUrlDirect: false, // default value
      signatureVersion: "v4", // default value
      globalCacheControl: null, // default value. Or 'public, max-age=86400' for 24 hrs Cache-Control
      ServerSideEncryption: "AES256|aws:kms", //AES256 or aws:kms, or if you do not pass this, encryption won't be done
      validateFilename: null, // Default to parse-server FilesAdapter::validateFilename.
      generateKey: null, // Will default to Parse.FilesController.preserveFileName
      s3overrides: {
        accessKeyId: process.env.S3_AWS_KEY,
        secretAccessKey: process.env.S3_AWS_SECRET,
      },
    },
  },
  maxUploadSize: process.env.MAX_UPLOAD_SIZE,
};
