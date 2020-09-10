export const topics = {
  'Reports & Petitions': ``,
  'OFF Speakers': ``,
  // 'Programs': ``,
  // 'Notes on Policy': ``,
}

function getContent(data, ) {

}

function setContent(feature, data) {
  return (menuTitle) => {
    const country = feature.properties.name;
    const content = document.getElementById('popup-content');
    if (menuTitle.includes('Speakers')) {
      content.innerHTML = `
        <table class="table">
          ${data['Speakers'].map((d, inx) => {
            if (inx === 0) {
              return `<tr>${Object.values(d).map(v => (`<td>${v}</td>`))}</tr>`;  
            } else {
              if (d.topicCountry.length === 0) return null;

              if (country.includes(d.topicCountry) || d.topicCountry.includes(country)) {
                return `<tr>${Object.keys(d).map(k => (`<td>${d[k]}</td>`))}</tr>`;
              } else {
                return null;
              }
            }
          })}
        </table>
      `;
    } else  if (menuTitle.includes('Reports')) {
      console.log(data['Annual Reports'])
      content.innerHTML = `
        <table class="table">
          ${data['Annual Reports'].map((d, inx) => {
            if (inx === 0) {
              return `<tr>${Object.values(d).map(v => (`<td>${v}</td>`))}</tr>`;  
            } else {
              if (!d.topicCountry) return null;

              if (country.includes(d.topicCountry) || d.topicCountry.includes(country)) {
                return `<tr>${Object.keys(d).map(k => (`<td>${d[k]}</td>`))}</tr>`;
              } else {
                return null;
              }
            }
          })}
        </table>
      `;
    } else if (menuTitle.includes('Programs')) {
      console.log(data)
    } else if (menuTitle.includes('Notes')) {
      // pass
    } else {
      content.innerHTML = '';
    }
  };
}

export default (feature, data) => {
  document.setContent = setContent(feature, data);
  const elts = Object.keys(topics).map(k => {
    return `<li class="menu"><a href="#" id="${k}" onclick="setContent('${k}')">${k}</a></li>`;
  });

  return `
    <div>
      <ul class="menu">
        ${elts}
      </ul>
      <div id="popup-content">
        <div>
          <ul>
            <li><p>name: ${data['Speakers'][1].name}</p></li>
          </ul>
        </div>
      </div>
    </div>
  `;
}