/* eslint-disable no-loop-func */
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import polylabel from 'polylabel';
// import regimeLegendSetup from './mapping/legends/regimes';
import { getColor, getCategory } from './data';
import setupLayers from './layers/index';
import Popup from '../components/Popup';

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

const setupFeatures = async (data, countries) => {
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

  const map = await setup(countries, speakers);
  return map;
}

const setup = async (countries, speakers) => {
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/drewstone/ckezzfdui0vq419t55kxnpvvj',
    center: [0.0, 30.0],
    zoom: 2
  });

  let hoveredStateId = null;
  let currentCoords = null;

  map.on('load', function() {
    setupLayers(map, countries, speakers)

    map.on('mousemove', function(e) { currentCoords = e.lngLat.wrap(); });

    map.on('mousemove', 'non-democratic-country-fills', function(e) {
      if (e.features.length > 0) {
        if (hoveredStateId) {
          map.setFeatureState({ source: 'non-democratic-countries', id: hoveredStateId }, { hover: false });
        }

        hoveredStateId = e.features[0].id;
        map.setFeatureState({ source: 'non-democratic-countries', id: hoveredStateId }, { hover: true });
      }

      map.getCanvas().style.cursor = 'pointer';
    });
  
    // When the mouse leaves the country-fill layer, update the feature state of the
    // previously hovered feature.
    map.on('mouseleave', 'non-democratic-country-fills', function() {
      map.getCanvas().style.cursor = '';
      if (hoveredStateId) {
        map.setFeatureState({ source: 'non-democratic-countries', id: hoveredStateId }, { hover: false });
      }
      hoveredStateId = null;
    }); 
    
    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'non-democratic-country-fills', function(e) {
      console.log(e.features[0].properties);
      addPopup(Popup({
        country: e.features[0].properties.admin,
        population: 1000,
        regimeType: getCategory(e.features[0]),
      }));
    });
  });

  const addPopup = (el) => {
    const placeholder = document.createElement('div');
    ReactDOM.render(el, placeholder);
  
    new mapboxgl.Popup()
                .setDOMContent(placeholder)
                .setLngLat(currentCoords)
                .setMaxWidth()
                .addTo(map);
  }

  return map;
};



export default setupFeatures;
