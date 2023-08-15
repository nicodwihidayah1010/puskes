    const { Client, LocalAuth } = require('whatsapp-web.js');

    const dialogflow = require('@google-cloud/dialogflow');
    const uuid = require('uuid');

    const express = require('express');
    const bodyParser = require('body-parser');
    const twilio = require('twilio');
 
    const projectId = 'bot-puskesmassumurbatu-hyde';
    const sessionId = uuid.v4();
 
    const sessionClient = new dialogflow.SessionsClient({
      keyFilename: "bot-puskesmassumurbatu-hyde-e419ff09bc3c.json"
    });
 
 
    const sessionPath = sessionClient.projectAgentSessionPath(
     projectId,
     sessionId
    );
 
    async function Chatting(inputText) {
    const request = {
     session: sessionPath,
     queryInput: {
         text: {
// note The query to send to the dialogflow agent
         text: inputText,
//note  The language used by the client (en-US)
         languageCode: 'id-ID',
         },
        },
    };
 
//note Send request and log result
     const responses = await sessionClient.detectIntent(request);
     console.log('Detected intent');
     const result = responses[0].queryResult;
    return result.fulfillmentText;
 
}
 
 
    const client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: { headless: false }
 
    });
 
    client.on('qr', (qr) => {
// note Generate and scan this code with your phone
     console.log('QR RECEIVED', qr);
    });
 
    client.on('ready', () => {
     console.log('Client is ready!');
    });
 
    client.on('message', async msg => {
      try {
//note msg.reply( await Chatting(msg.body))
            client.sendMessage(msg.from, await Chatting(msg.body));
        }
         catch(err) {
         console.log("opsie, " + err.message)
     }
    });
    client.initialize();