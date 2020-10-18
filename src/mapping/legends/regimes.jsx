export default () => {
	const layers = ['competitive authoritarian', 'fully authoritarian'];
  const colors = ['#F6911E', '#E80689'];
  const legend = document.getElementById('legend');
  for (let i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;
  
    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  }
}