export default (map, speakers) => {
  map.addSource('speakers', {
    'type': 'geojson',
    'data': speakers,
  });
  
  // Add an image to use as a custom marker
  map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', function(error, image) {
    if (error) throw error;
    map.addImage('custom-marker', image);
  
    // Add a symbol layer
    map.addLayer({
      'id': 'speakers',
      'type': 'symbol',
      'source': 'speakers',
      'layout': {
        'visibility': 'none',
        'icon-image': 'custom-marker',
        // get the title name from the source's "title" property
        'text-field': ['get', 'name'],
        'text-font': [
          'Open Sans Semibold',
          'Arial Unicode MS Bold'
        ],
        'text-offset': [0, 1.25],
        'text-anchor': 'top',
      },
      paint: {
        "text-color": "#ffffff"
      }
    });
  });
}