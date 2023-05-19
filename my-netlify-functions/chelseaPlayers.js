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
            personData = await axios.get(`https://api.football-data.org/v4/persons/${person.id}/matches`, { // changed 'id' to 'person.id'
                headers: { 'X-Auth-Token': 'af7450c5fc3541c3aede6334e63cb695' }
            });

            let stats = personData.data.aggregations;
            personsWithStats.push({
                name: person.name,
                position: person.position,
                matches: stats.matchesOnPitch,
                startingXI: stats.startingXI,
                goals: stats.goals,
                assists: stats.assists,
                yellowCards: stats.yellowCards
            });
        }
    } catch (error) {
        console.error(`Error: ${error}`);
    }

    res.send(personsWithStats);
});

app.listen(3000, () => console.log("Server is running..."));
