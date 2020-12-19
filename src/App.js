/* eslint-disable no-loop-func */

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import mapboxgl from 'mapbox-gl';
import getdocs from './util/webauth';
import setupFeatures from './mapping';

const countries = require('./countries.geo.json');
// You can use async/await or any function that returns a Promise
const setupMap = async () => {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
  const data = await getdocs({
    "installed": {
      "client_id": process.env.REACT_APP_CLIENT_ID,
      "project_id": process.env.REACT_APP_PROJECT_ID,
      "auth_uri": process.env.REACT_APP_AUTH_URI,
      "token_uri": process.env.REACT_APP_TOKEN_URI,
      "auth_provider_x509_cert_url": process.env.REACT_APP_AUTH_PROVIDER_X509_CERT_URL,
      "client_secret": process.env.REACT_APP_CLIENT_SECRET,
      "redirect_uris": process.env.REACT_APP_REDIRECT_URIS.split(','),
    }
  }, {
    "access_token": process.env.REACT_APP_ACCESS_TOKEN,
    "refresh_token":  process.env.REACT_APP_REFRESH_TOKEN,
    "scope": process.env.REACT_APP_SCOPE,
    "token_type": process.env.REACT_APP_TOKEN_TYPE,
    "expiry_date": Number(process.env.REACT_APP_EXPIRY_DATE),
  })
  
  const map = await setupFeatures(data, countries)
  return map;
}

function App() {
  const [map, setMap] = useState(null);

  useEffect(() => {
    (async function anyNameFunction() {
      const m = await setupMap();
      console.log(m);
      setMap(m);
    })();
  }, []);

  const handleClick = (e, layoutProperty) => {
    e.currentTarget.classList.toggle('active')
    const vis = map.getLayoutProperty(layoutProperty, 'visibility');
    // toggle layer visibility by changing the layout object's visibility property
    if (vis === 'visible') {
      map.setLayoutProperty(layoutProperty, 'visibility', 'none');
    } else {
      map.setLayoutProperty(layoutProperty, 'visibility', 'visible');
    }
  };

  const filterCountries = (e) => {};

  return (
    <div className="App">
      <header className="App-header">
        <nav id="menu">
          <div className="sub-menu">
            <Button
              className="active"
              variant="link"
              onClick={(e) => handleClick(e, 'non-democratic-country-fills')}>
              Regime Types
            </Button>
            <Button
              variant="link"
              onClick={(e) => handleClick(e, 'non-democratic-country-borders')}>
              Country Borders
            </Button>
            <Button
              variant="link"
              onClick={(e) => filterCountries(e, 'russia')}>
              Russia
            </Button>
          </div>
          <Accordion className="sub-menu">
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Public Education
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <div className="sub-menu">
                <Button>Conferences</Button>
                <Button>Student Events</Button>
              </div>
            </Accordion.Collapse>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              Advocacy
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <div className="sub-menu">
                <Button>Legal Advocacy</Button>
                <Button>Political Prisoners</Button>
                <Button>OFF Speakers</Button>
              </div>
            </Accordion.Collapse>
            <Accordion.Toggle as={Button} variant="link" eventKey="2">
              Policy Research
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <div className="sub-menu">
                <Button>Political Freedom</Button>
                <Button>Tech / Human Rights</Button>
                <Button>Regime Analyses</Button>
              </div>
            </Accordion.Collapse>
            <Accordion.Toggle as={Button} variant="link" eventKey="3">
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

export default App;
