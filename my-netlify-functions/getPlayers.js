const axios = require('axios');

const apiKey = '<3eac65806bmshf36f1b84adebc7bp1533f2jsnd397ef53e279>';  // Replace <your-api-key> with the key obtained from RapidAPI
const headers = {
    'x-rapidapi-key': apiKey,
    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
    'useQueryString': true
}

const team_id = 49;  // ID of Chelsea team on API-Football, double check this is still current

async function getPlayers(team_id) {
    const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/players?team=${team_id}`, { headers });
    return response.data.response;
}

async function getPlayerStats(player_id) {
    const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/players/${player_id}`, { headers });
    return response.data.response[0].statistics;
}

exports.handler = async (event, context) => {
    try {
        const playersData = await getPlayers(team_id);
        const playersWithStats = await Promise.all(playersData.map(async player => {
            const statsData = await getPlayerStats(player.player.id);
            const stats = statsData.find(stat => stat.team.id === team_id);
            return {
                name: player.player.name,
                position: player.player.position,
                matches: stats.games.appearences,
                startingXI: stats.games.lineups,
                goals: stats.goals.total,
                assists: stats.goals.assists,
                yellowCards: stats.cards.yellow,
                redCards: stats.cards.red
            };
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(playersWithStats)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: error.message })
        };
    }
}
