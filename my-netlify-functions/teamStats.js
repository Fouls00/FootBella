const axios = require('axios');

async function getTeamStats() {
    try {
        // You might need to adjust this URL for your specific team and competition
        const response = await axios.get('https://api.football-data.org/v4/competitions/PL/standings', {
            headers: { 'X-Auth-Token': 'af7450c5fc3541c3aede6334e63cb695' },
        });

        const data = response.data;

        // Find Chelsea in the standings
        const chelseaStats = data.standings[0].table.find(team => team.team.id === 61);
        if (!chelseaStats) {
            return { statusCode: 404, body: JSON.stringify({ msg: 'Chelsea not found in standings' }) };
        }

        // Create the stats string
        const stats = `Position: ${chelseaStats.position}\n` +
                      `Points: ${chelseaStats.points}\n` +
                      `Wins: ${chelseaStats.won}\n` +
                      `Draws: ${chelseaStats.draw}\n` +
                      `Losses: ${chelseaStats.lost}\n` +
                      `Goals For: ${chelseaStats.goalsFor}\n` +
                      `Goals Against: ${chelseaStats.goalsAgainst}`;

        const responseBody = {
            fulfillmentText: stats,
        };

        return { statusCode: 200, body: JSON.stringify(responseBody) };
    } catch (error) {
        console.log(error);
        return { statusCode: 500, body: JSON.stringify({ msg: error.message }) };
    }
};

exports.handler = getTeamStats;
