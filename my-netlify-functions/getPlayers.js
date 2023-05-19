const axios = require('axios');

async function getPlayerStats() {
    try {
        const teamData = await axios.get("https://api.football-data.org/v4/teams/61", {
            headers: { 'X-Auth-Token': 'af7450c5fc3541c3aede6334e63cb695' }
        });

        let persons = teamData.data.squad;
        let personsWithStats = [];

        for (let person of persons) {
            const personData = await axios.get(`https://api.football-data.org/v4/persons/${person.id}/matches`, {
                headers: { 'X-Auth-Token': 'af7450c5fc3541c3aede6334e63cb695' }
            });

            let stats = personData.data.aggregations;
            let personStats = {
                name: person.name,
                position: person.position,
                matches: stats ? stats.matchesOnPitch : 'NA',
                wins: stats ? stats.wins : 'NA',
                goals: stats ? stats.goals : 'NA',
                assists: stats ? stats.assists : 'NA',
                yellowCards: stats ? stats.yellowCards : 'NA'
            };

            // Assign additional stats based on position
            if (person.position === "Defender") {
                personStats.dryMatches = stats ? stats.dryMatches : 'NA';
            }

            personsWithStats.push(personStats);
        }

        const responseBody = {
            fulfillmentText: personsWithStats,
        };

        return { statusCode: 200, body: JSON.stringify(responseBody) };
    } catch (error) {
        console.log(error);
        return { statusCode: 500, body: JSON.stringify({ msg: error.message }) };
    }
}

exports.handler = getPlayerStats;
