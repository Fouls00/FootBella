const axios = require('axios');

async function getPersonStats(personId) {
  // Fetch person statistics from an endpoint
  const response = await axios.get(`http://api.football-data.org/v4/persons/{id}`, {
    headers: { 'X-Auth-Token': 'af7450c5fc3541c3aede6334e63cb695' },
  });
  const data = response.data;
  
  // Extract and return the necessary stats
  const stats = {
    matches: data.matches,
    wins: data.wins,
    // ...more stats
  };
  
  return stats;
}

exports.handler = async function(event, context) {
  try {
    const response = await axios.get('http://api.football-data.org/v4/teams/61', {
        headers: { 'X-Auth-Token': 'af7450c5fc3541c3aede6334e63cb695' },
    });
    const data = response.data;

    // An array to hold all our person stats promises
    const personStatsPromises = [];

    for (const person of data.squad) {
      // For each person, get their stats and store the promise in our array
      personStatsPromises.push(getPersonStats(person.id));
    }

    // Wait for all person stats promises to resolve
    const allPersonStats = await Promise.all(personStatsPromises);

    // Combine the person names, ids, and stats into the final output
    const persons = data.squad.map((person, index) => `${person.position} - ${person.name} (${person.id}) - ${allPersonStats[index].matches} / ${allPersonStats[index].wins} / ...`);

    const responseBody = {
      fulfillmentText: persons.join('\n'),
    };

    return { statusCode: 200, body: JSON.stringify(responseBody) };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: JSON.stringify({ msg: error.message }) };
  }
};
