"use strict";

require('dotenv-extended').load();
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');
var viber = require('botbuilder-viber');
const express = require('express');
const app = express();
var http =  process.env.HTTPS === 'false' ? require('http') : require('https');
var server = http.createServer(app);
var port= process.env.port || 3978;


var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});
var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage);

app.post('/api/messages', connector.listen());

var viberOptions = {
    Token: process.env.VIBER_TOKEN,
    Name: process.env.VIBER_BOT_NAME,  
    AvatarUrl: process.env.VIBER_AVATAR_URL
  }

// Initialising viber channel, bot's connectors  
var viberChannel = new viber.ViberEnabledConnector(viberOptions);
bot.connector(viber.ViberChannelId, viberChannel);
app.use('/viber/webhook', viberChannel.listen());

// start the server
app.listen(port, function() {
    console.log('Listening on %s', port);
  });


bot.dialog('/', [
    function(session)
    {   
        session.send("hi");
        session.beginDialog("askforpic");
    }
   
]

);

//main part of the discussion
bot.dialog('askforpic', [
    function(session)
    {   
        builder.Prompts.attachment(session, "Please attach a picture");       
    },
    function(session, results)
    {
        session.userData.pic = results.response;
        session.endDialog("Thank you!");                
    }	
]

);


