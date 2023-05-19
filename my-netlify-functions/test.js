const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const response = await axios.get('http://api.football-data.org/v4/teams/61', {
            headers: { 'X-Auth-Token': 'af7450c5fc3541c3aede6334e63cb695' },
        });
        const data = response.data;
        const players = data.squad.map(player => `${player.position} - ${player.name}`);
        const allPlayers = players.join('\n'); // joins all player strings with a newline character

        return { 
            statusCode: 200, 
            body: JSON.stringify({
                fulfillmentMessages: [
                    {
                        text: {
                            text: [allPlayers]
                        }
                    }
                ]
            }) 
        }
    } catch (error) {
        console.log(error);
        return { statusCode: 500, body: JSON.stringify({ msg: error.message }) };
    }
};