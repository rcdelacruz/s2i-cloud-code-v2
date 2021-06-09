module.exports = {
    databaseURI: process.env.DATABASE_URI || 'mongodb://localhost:27017/dev',
    appId: process.env.APP_ID || 'myAppId',
    clientKey: process.env.CLIENT_KEY || 'myClientKey',
    masterKey: process.env.MASTER_KEY || 'masterKey', //Add your master key here. Keep it secret!
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
    javascriptKey: process.env.JAVASCRIPT_KEY || 'myJSKey',
    restAPIKey: process.env.REST_API_KEY || 'restAPIKey',
    cloud: process.env.PARSE_CLOUD_CODE || './cloud/main.js',
    liveQuery: {
      classNames: process.env.LIVE_QUERY_CLASSNAMES
        ? process.env.LIVE_QUERY_CLASSNAMES.split(',')
        : [],
    },
    push: (process.env.PUSH_ENABLED === "true") ? {
      android: {
        apiKey: process.env.ANDROID_API_KEY,
      },
      ios: {
        pfx: process.env.IOS_CERT_PATH,
        passphrase: process.env.IOS_PASSPHRASE || '',
        bundleId: process.env.IOS_BUNDLE_ID,
        production: process.env.IOS_PRODUCTION_MODE || false,
      }
    } : {},
    verbose: false,
    emailAdapter: {
      module: process.env.EMAIL_ADAPTER,
      options: {
        fromAddress: process.env.EMAIL_FROM_ADDRESS,
        user: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD,
        host: process.env.SMTP_HOST,
        isSSL: (process.env.SMTP_SSL === "true") ? true : false,
        port: process.env.SMTP_PORT,
        templates: process.env.EMAIL_TEMPLATES || {}
      }
    } 
  }
