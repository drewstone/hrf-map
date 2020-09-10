const documents = [{
  id: '1uZHaShIWxrbSop8Hh2O_NOCRJag9bnVm6uy9-g7LZs8',
  range: 'Speakers',
}, {
  id: '1zGxWUq2V_8Vm3vcYc-n80HhvxuxlxuIal8NvZenEeBA',
  range: 'Annual Reports',
}, {
  id: '1p1zCkEsOrVEXp9nipEtHkriljapWB5DyS2nase_EqUE',
  range: 'Petitions',
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
    if (doc.range === 'Speakers') {
      if (rows.length) {
        // Print columns A and E, which correspond to indices 0 and 4.
        data[doc.range] = rows.map((row) => {
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
        });
      } else {
        console.log('No data found.');
      }
    } else if (doc.range === 'Annual Reports') {
        // Print columns A and E, which correspond to indices 0 and 4.
        data[doc.range] = rows.map((row) => {
          return {
            name: row[0],
            description:  row[1],
            pictureUrl: row[3],
            fileLink: row[5],
            reportType: row[6],
          };
        });
    } else if (doc.range === 'Petitions') {
        // Print columns A and E, which correspond to indices 0 and 4.
        data[doc.range] = rows.map((row) => {
          return {
            name: row[0],
            description:  row[2],
            blurb: row[3],
            pictureUrl: row[4],
          };
        });
    }
  }));

  return data;
};
