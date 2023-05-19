const axios = require('axios');

async function getPlayerNames() {
    try {
        const teamResponse = await axios.get('https://api.football-data.org/v4/teams/61', {
            headers: { 'X-Auth-Token': 'af7450c5fc3541c3aede6334e63cb695' },
        });
        const teamData = teamResponse.data;

        let players = [];

        for (const player of teamData.squad) {
            const playerResponse = await axios.get(`https://api.football-data.org/v4/persons/${player.id}`, {
                headers: { 'X-Auth-Token': 'af7450c5fc3541c3aede6334e63cb695' },
            });
            const playerData = playerResponse.data;

            let playerInfo = {
                name: player.name,
                position: player.position,
                // Add or adjust these properties according to the actual structure of playerData
                matches: playerData.matches,  
                wins: playerData.wins,
                cleanSheets: playerData.cleanSheets,
                goals: playerData.goals,
                assists: playerData.assists,
                yellowCards: playerData.yellowCards,
            };

            players.push(playerInfo);
        }

        let messageText = players.map(player => `${player.position} - ${player.name}: Matches ${player.matches} / Wins ${player.wins} / Clean Sheets ${player.cleanSheets} / Goals ${player.goals} / Assists ${player.assists} / Yellow Cards ${player.yellowCards}`).join("\n");

        return {
            fulfillmentMessages: [{
                text: {
                    text: [messageText],
                },
            }],
        };
    } catch (error) {
        console.log(error);
        return { fulfillmentText: "Error occurred while fetching player information." };
    }
};

getPlayerNames();
