const axios = require('axios');

async function getPlayerStats(playerId) {
  // Fetch player statistics from an endpoint
  const response = await axios.get(`http://api.football-data.org/v4/players/${playerId}`, {
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

    // An array to hold all our player stats promises
    const playerStatsPromises = [];

    for (const player of data.squad) {
      // For each player, get their stats and store the promise in our array
      playerStatsPromises.push(getPlayerStats(player.id));
    }

    // Wait for all player stats promises to resolve
    const allPlayerStats = await Promise.all(playerStatsPromises);

    // Combine the player names, ids, and stats into the final output
    const players = data.squad.map((player, index) => `${player.position} - ${player.name} (${player.id}) - ${allPlayerStats[index].matches} / ${allPlayerStats[index].wins} / ...`);

    const responseBody = {
      fulfillmentText: players.join('\n'),
    };

    return { statusCode: 200, body: JSON.stringify(responseBody) };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: JSON.stringify({ msg: error.message }) };
  }
};
