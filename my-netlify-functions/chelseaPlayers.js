const axios = require("axios");
const express = require("express");
const app = express();

app.get("/getPlayers", async (req, res) => {
    let teamData;
    let playerData;
    let playersWithStats = [];
    try {
        teamData = await axios.get("https://api.football-data.org/v4/teams/61", {
            headers: { 'X-Auth-Token': 'af7450c5fc3541c3aede6334e63cb695' }
        });
        let players = teamData.data.squad;

        for(let player of players){
            playerData = await axios.get(`https://api.football-data.org/v4/persons/${player.id}/matches`, {
                headers: { 'X-Auth-Token': 'af7450c5fc3541c3aede6334e63cb695' }
            });

            let stats = playerData.data.aggregations;
            playersWithStats.push({
                name: player.name,
                position: player.position,
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

    res.send(playersWithStats);
});

app.listen(3000, () => console.log("Server is running..."));
