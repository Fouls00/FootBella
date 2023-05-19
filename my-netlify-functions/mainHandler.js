const chelseaPlayersHandler = require('./getPlayers');
const teamStatsHandler = require('./teamStats');

exports.handler = async function(event, context) {
  // Parse the incoming request
  const body = JSON.parse(event.body);
  const intentName = body.queryResult.intent.displayName;
  
  // Call the appropriate function based on the intent
  switch (intentName) {
    case 'GetChelseaPlayers':
      return await chelseaPlayersHandler.handler(event, context);
    case 'GetTeamStats':
      return await teamStatsHandler.handler(event, context);
    default:
      return { 
        statusCode: 400, 
        body: JSON.stringify({ msg: `Unrecognized intent: ${intentName}` }) 
      };
  }
};
