/* eslint-disable no-loop-func */

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Dropdown, DropdownButton, ButtonGroup, Accordion, Button } from 'react-bootstrap';
import mapboxgl from 'mapbox-gl';
import setup from './mapping';
import { getColor } from './mapping/data';
import polylabel from 'polylabel';
import getdocs from './util/webauth';
import createDescription from './util/formatPopup';
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

  componentDidMount() {
    const speakers = {
      type: 'FeatureCollection',
      features: [],
    };

    getdocs(credentials, token).then((data) => {
      countries.features = countries.features.map((feature, inx) => {
        const p = polylabel(feature.geometry.coordinates, 0.1);
        if (!isNaN(p[0])) {
          data['Speakers'].forEach(speaker => {
            if (isIncident(speaker, feature)) {
                speakers.features.push(createFeature(speaker, feature, p));
              }
          });
        }

        return { ...feature, id: inx, properties: {
            ...feature.properties,
            color: getColor(feature),
          }
        }
      });
    
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
      this.map = setup(countries, speakers);
    });
  }

  handleClick(e, layoutProperty) {
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
          <nav id="menu"></nav>
          <div id="map"></div>
          <DropdownButton as={ButtonGroup} title="Layers" id="bg-vertical-dropdown-3">
            <Dropdown.Item
              eventKey="1"
              onClick={(e) => this.handleClick(e, 'non-democratic-country-fills')}
            >
              Regime Types
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="2"
              onClick={(e) => this.handleClick(e, 'speakers')}
            >Speakers</Dropdown.Item>
            <Dropdown.Item
              eventKey="3"
              onClick={(e) => this.handleClick(e, 'non-democratic-country-borders')}
            >Country Borders</Dropdown.Item>
          </DropdownButton>
          <div className='map-overlay' id='legend'></div>
        </header>
      </div>
    );
  }

}

export default App;
