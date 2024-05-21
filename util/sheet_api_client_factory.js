
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these SCOPES, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'accessToken.json';

class SheetApiClientFactory {
  static async create() {

    const credential = fs.readFileSync('credentials.json');

    const auth = await this._authorize(JSON.parse(credential));

    return google.sheets({version: 'v4', auth});
  }

  static async _authorize(credentials) {

    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (!fs.existsSync(TOKEN_PATH)) {
      const token = await this._getNewToken(oAuth2Client);
      oAuth2Client.setCredentials(token);

      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log('Token stored to', TOKEN_PATH);

      return oAuth2Client;
    }

    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);

    return oAuth2Client;
  }

  static async _getNewToken(oAuth2Client) {

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const code = await new Promise((resolve) => {
      rl.question('Enter the code from that page here: ', (code) => {

        resolve(code);

      });
    });

    rl.close();

    const resp = await oAuth2Client.getToken(code);
    return resp.tokens;
  }

}

module.exports = SheetApiClientFactory;