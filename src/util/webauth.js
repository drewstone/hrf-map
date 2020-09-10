const { OAuth2Client } = require('google-auth-library');
const getData = require('./data');
/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the full client to the callback.
 */
function getAuthenticatedClient(credentials, token) {
  return new Promise((resolve) => {
    // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
    // which should be downloaded from the Google Developers Console.
    const oAuth2Client = new OAuth2Client(
      credentials.installed.client_id,
      credentials.installed.client_secret,
      credentials.installed.redirect_uris[0]
    );
    oAuth2Client.setCredentials(token);
    resolve(oAuth2Client);
  });
}

export default function (credentials, token) {
  return getAuthenticatedClient(credentials, token)
  .then((client) => {
    return getData(client);
  });
};
