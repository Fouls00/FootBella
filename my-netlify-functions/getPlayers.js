const axios = require('axios');

exports.handler = async function(event, context) {
    let teamData;
    let personData;
    let personsWithStats = [];
    try {
        teamData = await axios.get("https://api.football-data.org/v4/teams/61", {
            headers: { 'X-Auth-Token': 'af7450c5fc3541c3aede6334e63cb695' }
        });
        let persons = teamData.data.squad;

        for(let person of persons){
            personData = await axios.get(`https://api.football-data.org/v4/persons/${person.id}/matches`, {
                headers: { 'X-Auth-Token': 'af7450c5fc3541c3aede6334e63cb695' }
            });

            let stats = personData.data.aggregations;

            // Position mapping
            let generalPosition;
            if(person.position.includes("Back") || person.position.includes("Centre-Back")){
                generalPosition = "Defender";
            } else if(person.position.includes("Midfield")){
                generalPosition = "Midfield";
            } else if(person.position.includes("Wing") || person.position.includes("Forward")){
                generalPosition = "Offence";
            } else {
                generalPosition = "GoalKeeper";
            }

            personsWithStats.push({
                name: person.name,
                position: generalPosition,
                matches: stats.matchesOnPitch,
                goals: stats.goals,
                assists: stats.assists,
                yellowCards: stats.yellowCards
            });
        }
    } catch (error) {
        console.error(`Error: ${error}`);
    }

    // Fulfillment response for Dialogflow
    // Must be a stringified version of the JSON object
    let response = {
      "fulfillmentText": JSON.stringify(personsWithStats),
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
};
