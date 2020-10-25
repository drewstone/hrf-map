const documents = [{
  id: '1nFtsqo6o-1JvXZ6j__G1o3tH_22DxQWtuCI-QXSRcis',
  range: 'Democratic Regime',
}, {
  id: '1nFtsqo6o-1JvXZ6j__G1o3tH_22DxQWtuCI-QXSRcis',
  range: 'Competitive Authoritarian Regime',
}, {
  id: '1nFtsqo6o-1JvXZ6j__G1o3tH_22DxQWtuCI-QXSRcis',
  range: 'Fully Authoritarian Regime',
}, {
  id: '1uZHaShIWxrbSop8Hh2O_NOCRJag9bnVm6uy9-g7LZs8',
  range: 'Speakers',
}, {
  id: '1zGxWUq2V_8Vm3vcYc-n80HhvxuxlxuIal8NvZenEeBA',
  range: 'Annual Reports',
}, {
  id: '1p1zCkEsOrVEXp9nipEtHkriljapWB5DyS2nase_EqUE',
  range: 'Reports',
}, {
  id: '1p1zCkEsOrVEXp9nipEtHkriljapWB5DyS2nase_EqUE',
  range: 'Legal Cases',
}, {
  id: '1kr7XwlXU_ZFAwp9FBVPTDXdRqESuQ-WZ9onJ_XZWoWI',
  range: 'News Posts',
}, {
  id: '1kr7XwlXU_ZFAwp9FBVPTDXdRqESuQ-WZ9onJ_XZWoWI',
  range: '1-100',
}]

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
export default async (auth) => {
  const client = auth;
  const data = {};
  await Promise.all(documents.map(async (doc) => {
    const res = await client.request({
      url: `https://sheets.googleapis.com//v4/spreadsheets/${doc.id}/values/${doc.range}`
    })

    const rows = res.data.values;
    data[doc.range] = rows.map((row) => {
      if (doc.range === 'Speakers') {
        // Print columns A and E, which correspond to indices 0 and 4.
        return {
          name: row[0],
          description:  row[1],
          pictureUrl: row[3],
          speakerTitle: row[5],
          twitter: row[6],
          topicCountry: row[7],
          topicRegion: row[8],
          categories: row[11],
        };
      } else if (doc.range === 'Annual Reports') {
        // Print columns A and E, which correspond to indices 0 and 4.
        return {
          name: row[0],
          description:  row[1],
          pictureUrl: row[3],
          fileLink: row[5],
          reportType: row[6],
        };
      } else if (doc.range === 'Petitions') {
        // Print columns A and E, which correspond to indices 0 and 4.
        return {
          name: row[0],
          description:  row[2],
          blurb: row[3],
          pictureUrl: row[4],
        };
      } else if (doc.range === 'Democratic Regime'
        || doc.range === 'Competitvely Authoritarian Regime'
        || doc.range === 'Fully Authoritarian Regime'
      ) {
        return { name: row[0], population: row[1] };
      }
    });
  }));

  return data;
};
