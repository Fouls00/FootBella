const axios = require("axios");
const express = require("express");
const app = express();

app.get("/getPlayers", async (req, res) => {
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
    } catch (error) {
        console.error(`Error: ${error}`);
    }

    res.send(personsWithStats);
});

app.listen(3000, () => console.log("Server is running..."));
