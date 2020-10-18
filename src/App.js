/* eslint-disable no-loop-func */

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Accordion, Button } from 'react-bootstrap';
import polylabel from 'polylabel';
import mapboxgl from 'mapbox-gl';

import setup from './mapping';
import regimeLegendSetup from './mapping/legends/regimes';
import { getColor } from './mapping/data';



import getdocs from './util/webauth';
const countries = require('./countries.geo.json');

const credentials = {
  "installed": {
    "client_id": process.env.REACT_APP_CLIENT_ID,
    "project_id": process.env.REACT_APP_PROJECT_ID,
    "auth_uri": process.env.REACT_APP_AUTH_URI,
    "token_uri": process.env.REACT_APP_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.REACT_APP_AUTH_PROVIDER_X509_CERT_URL,
    "client_secret": process.env.REACT_APP_CLIENT_SECRET,
    "redirect_uris": process.env.REACT_APP_REDIRECT_URIS.split(','),
  }
}

const token = {
  "access_token": process.env.REACT_APP_ACCESS_TOKEN,
  "refresh_token":  process.env.REACT_APP_REFRESH_TOKEN,
  "scope": process.env.REACT_APP_SCOPE,
  "token_type": process.env.REACT_APP_TOKEN_TYPE,
  "expiry_date": Number(process.env.REACT_APP_EXPIRY_DATE),
};

const isIncident = (speaker, feature) => {
  if (speaker.topicCountry === feature.properties.formal_en
    || speaker.topicCountry === feature.properties.admin
    || speaker.topicCountry === feature.properties.name
    || speaker.speakerTitle.includes(feature.properties.formal_en)
    || speaker.speakerTitle.includes(feature.properties.admin)
    || speaker.speakerTitle.includes(feature.properties.name)) {
      return true;
  }
};

const createFeature = (speaker, feature, p) => {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [p[0], p[1]],
    },
    properties: {
      title: speaker.speakerTitle,
      name: speaker.name,
      country: feature.properties.name,
      description: speaker.description,
      region: speaker.topicRegion,
      twitter: speaker.twitter,
    }
  }
}

class App extends React.Component {
  map;
  selected;

  constructor() {
    super();
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    this.selected = 'regime';
  }

  componentDidMount() {
    getdocs(credentials, token)
      .then(this.setupFeatures.bind(this))
      .then(regimeLegendSetup);
  }

  setupFeatures(data) {
    const speakers = {
      type: 'FeatureCollection',
      features: [],
    };

    countries.features = countries.features.map((feature, inx) => {
      const p = polylabel(feature.geometry.coordinates, 0.1);
      if (!isNaN(p[0])) {
        // for each speaker, add a marker feature at the center
        // of the country that the speaker is representing.
        data['Speakers'].forEach(speaker => {
          if (isIncident(speaker, feature)) {
            speakers.features.push(createFeature(speaker, feature, p));
          }
        });
      }

      return {
        ...feature,
        id: inx,
        properties: {
          ...feature.properties,
          color: getColor(feature),
        }
      }
    });
  
    this.map = setup(countries, speakers);
  }

  handleClick(e, layoutProperty) {
    e.currentTarget.classList.toggle('active')
    const vis = this.map.getLayoutProperty(layoutProperty, 'visibility');
    // toggle layer visibility by changing the layout object's visibility property
    if (vis === 'visible') {
      this.map.setLayoutProperty(layoutProperty, 'visibility', 'none');
      this.className = '';
    } else {
      this.map.setLayoutProperty(layoutProperty, 'visibility', 'visible');
      this.className = 'active';
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <nav id="menu">
            <div className="sub-menu">
              <Button
                className="active"
                variant="dark"
                onClick={(e) => this.handleClick(e, 'non-democratic-country-fills')}>
                Regime Types
              </Button>
            </div>
            <Accordion className="sub-menu">
              <Accordion.Toggle as={Button} variant="dark" eventKey="0">
                Public Education
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <div className="sub-menu">
                  <Button>Conferences</Button>
                  <Button>Student Events</Button>
                </div>
              </Accordion.Collapse>
              <Accordion.Toggle as={Button} variant="dark" eventKey="1">
                Advocacy
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1">
                <div className="sub-menu">
                  <Button>Legal Advocacy</Button>
                  <Button>Political Prisoners</Button>
                  <Button>OFF Speakers</Button>
                </div>
              </Accordion.Collapse>
              <Accordion.Toggle as={Button} variant="dark" eventKey="2">
                Policy Research
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="2">
                <div className="sub-menu">
                  <Button>Political Freedom</Button>
                  <Button>Tech / Human Rights</Button>
                  <Button>Regime Analyses</Button>
                </div>
              </Accordion.Collapse>
              <Accordion.Toggle as={Button} variant="dark" eventKey="3">
                Direct Support
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="3">
                <div className="sub-menu">
                  <Button>Networking Opportunities</Button>
                  <Button>Micro-grants</Button>
                </div>
              </Accordion.Collapse>
            </Accordion>
          </nav>
          <div id="map"></div>
          <div className='map-overlay' id='legend'></div>
        </header>
      </div>
    );
  }

}

export default App;
