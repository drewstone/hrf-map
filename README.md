# Human Rights Foundation Map
This repo contains a Mapbox map for displaying HRF's data and content.

Additional work on this project is important to add more data about HRF's activities. We welcome open contributions to add different layers and datasets to this map that are relevant to HRF's mission. Additionally, we welcome design ideas around how the data should be toggled and overlayed.

Contributions are welcomed as new issues or PRs. Ideas for contributions or future work are:
- Add new layers to the map, such as toggling countries incident on an HRF project, proposal, or past legal work
- Add designs for buttons and legends on the map.
- Add new interactions to improve the user experience.

Currently there are a number of unimplemented buttons and layers for data.
- We are pulling in data for a variety of spreadsheets but not creating proper layers for them.
- We have a number of buttons shown on our menu of the map, but they are not interactive yet.
- We could improve the design of the legends and overall buttons shown.

## Data
The data being loaded and displayed on the map starts with HRF's regime classification for countries and displays countries that fall into the authoritarian and competitive-authoritarian regimes.

Secondarily, the map currently displays:
- country borders of countries that fall in those regime types
- speakers from around the world from HRF's speaker series and OFF participants.

Data from around HRF's organisation is being pulled in from Google Spreadsheets and is intended to be overlayed on the map to extend the features of the map as well. Some of this data is:
- Reports and legal work
- Events
- Overviews of projects such as the Flash drives for Freedom

The datasets currently being accessed can be found in `src/util/data`. While we are pulling this data in, there is currently no formatting of the data into layers for the map for many of the datasets.

## Credentials

There are a variety of credentials and tokens required for running the application locally and deploying the application in production, which is currently hosted using the service `vercel`. Most of these credentials are for Google's OAUTH. You can find more info on how to generate them here: https://developers.google.com/identity/protocols/oauth2. You will want to generate the corresponding credentials so that you can populate the data in the `.env` file describe below.

First, it is necessary that you create a `.env` file in the base directory of the project and fill it with the following data, which you will also need to fill in if you use a service like `vercel` which requires you to add environment variables on the fly. You should not commit these files to any public repository ever as these are intended to be private environment variables.
```
REACT_APP_MAPBOX_TOKEN=<PROVIDED_BY_MAPBOX>
REACT_APP_CLIENT_ID=<PROVIDED_BY_GOOGLE>
REACT_APP_PROJECT_ID=<PROVIDED_BY_GOOGLE>
REACT_APP_AUTH_URI=https://accounts.google.com/o/oauth2/auth
REACT_APP_TOKEN_URI=https://oauth2.googleapis.com/token
REACT_APP_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
REACT_APP_CLIENT_SECRET=<PROVIDED_BY_GOOGLE>
REACT_APP_REDIRECT_URIS=urn:ietf:wg:oauth:2.0:oob,http://localhost
REACT_APP_ACCESS_TOKEN=<PROVIDED_BY_GOOGLE>
REACT_APP_REFRESH_TOKEN=<PROVIDED_BY_GOOGLE>
REACT_APP_SCOPE=https://www.googleapis.com/auth/spreadsheets.readonly
REACT_APP_TOKEN_TYPE=Bearer
REACT_APP_EXPIRY_DATE=<SOME_DATE>
```

### Mapbox

The Mapbox token can be generated by creating a Mapbox account and then finding your OAUTH/API keys. Information about these access tokens can be found here: https://docs.mapbox.com/help/how-mapbox-works/access-tokens/.

### Google OAUTH
The Google authentication parameters labelled above are provided by your Google account in the following format. These credentials will be provided by the Google OAUTH system in the following formats. You can read more about generating them for your specific application here: https://developers.google.com/identity/protocols/oauth2. The OAUTH protocol to get these credentials for front-end Javascript applications can be found here: https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow/.

The files will look like:
```
{
	"installed": {
		"client_id":"<CLIENT_ID_DATA>.apps.googleusercontent.com",
		"project_id":"quickstart-<PROJECT_ID_DATA>",
		"auth_uri":"https://accounts.google.com/o/oauth2/auth",
		"token_uri":"https://oauth2.googleapis.com/token",
		"auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
		"client_secret":"<CLIENT_SECRET",
		"redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]
	}
}
```

Accessing spreadsheet requires a separate set of credentials as well. These will be provided by Google in the following format. More about how to generate these tokens for specific applications, namely Spreadsheets, can be found here: https://developers.google.com/sheets/api/guides/authorizing.
```
{
	"access_token":"",
	"refresh_token":"",
	"scope":"https://www.googleapis.com/auth/spreadsheets.readonly",
	"token_type":"Bearer",
	"expiry_date":1598218812359
}
```

## Repo structure

All relevant files in the repo are located in the `src` directory, which contains the UI files for rendering the application as well as the scripts necessary for loading data from Google Sheets and formatting it for the mapbox map.

### App Access point
The top level file where the map and access controls are initialised is located in the `App.js` file. Here, we manage the main access point for the UI of the application. We set the map up here and we get all the documents from Google Spreadsheet for data we are interested in displaying. In the `App.js` file, we create the menu items for toggling different functionality on our map, such as toggling the regime types, country borders, and/or speakers.

To add a new toggle button to the map, we simply add a new element to the `sub-menu` div demonstrated below and implement a function for handling clicks of it defined as `handleNewToggleButton()`.
```
	<Button
		variant="link"
		onClick={(e) => handleNewToggleButton()}>
		New Toggle Button
	</Button>
```
Handlers on these buttons should interact directly with the Mapbox map for the intended effect. There are a variety of button types defined in the top-level app, some which are not functional at the moment but rather demonstrate the range of UI components one can use to design interactions on top of the map such as Accordion button lists. The buttons inside these should be handled similarly to any other to achieve the desired interaction on the map.

### Map
The map is setup and initialised in the `src/mapping/index.js` file. This is called from the top level app with the data needed. In this file, we initialise the actions and layers on our app, such as registering mouse locations on-hovering over our app, clicks on the layers themselves, and any other components we want to add to our app. In this file, we work directly with the Mapbox API. For more ideas on how to customize the map, it is recommend that you consult with the Mapbox API documentation directly.

### Map Layers
The main purpose of the app is to effectively toggle data on and off the map. We refer to data on the map as a `layer` and so we are toggling `layers` on/off the map. Layers are defined in the Mapbox system using a specific format that the map API can process. More information about mapbox layers can be found here: https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/.

Layers on our map are managed in the `src/mapping/layers` directory. Each layer is added in conjunction with a dataset, called a `source`. In order to be able to have a functional layer, it must also reference its data source. You can find examples for the `regimes` and `speakers` layers in that directory. Information for designing and customizing layers can be found here: https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/.

### Map Legends

Currently there is not huge support for legends but an example exists. It is created in the top-level `App.js` file, though we actually embed the legend described in the `src/mapping/legends` directory.

### Data

There is a file called `src/mapping/data.js` that holds some hardcoded data about the regime types, speakers, and links to talks. This data is used in the `src/mapping/index.js` and formatted into the proper format for features to be overlayed on the map. If there is a need to add more hardcoded data directly, this file can be used to store it.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Learn More

This project was created with `create-react-app`. 

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).