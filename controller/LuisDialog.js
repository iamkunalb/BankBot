var builder = require('botbuilder');
var user = require("./UserInfo");
var appo = require("./appointment");
var restaurant = require('./RestaurantCard');
var nutrition = require('./exchangeCard');
var customVision = require('./CustomVision');
var rate = require('./exchange');


var qna = require('./QnAMaker');
var isAttachment = false;

var fx = require('money');
var oxr = require('open-exchange-rates');


exports.startDialog = function (bot) {
var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ec926813-cefe-4b18-9cca-653b299f0fc0?subscription-key=d7ec4fd2666b4ae2a2ad725cc01ffe2e&verbose=true&timezoneOffset=0&q=');
bot.recognizer(recognizer);
bot.dialog('GetUserInfo', [
    function (session, args, next) {
        session.dialogData.args = args || {};   
             
        if (!session.conversationData["accountno"]) {
            builder.Prompts.text(session, "Please enter your account number.");   
                         
        } else {
            next();
        }
    },
    function (session, results, next) {
        if (!isAttachment(session)) {

            if (results.response) {
                session.conversationData["accountno"] = results.response;
            }

            session.send("Retrieving your recent transactions");
            user.displayUserInfo(session, session.conversationData["accountno"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
        }
    }
]).triggerAction({
    matches: 'GetUserInfo'
});

bot.dialog('GetHelp', [
    function (session, results, next) {
        if (!isAttachment(session)) {
            var card = {
                'contentType': 'application/vnd.microsoft.card.adaptive',
                'content': {
                    '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
                    'type': 'AdaptiveCard',
                    'version': '1.0',
                    'body': [
                        {
                            'type': 'Container',
                            'items': [
                                {
                                    'type': 'ColumnSet',
                                    'columns': [
                                        {
                                            'type': 'Column',
                                            'size': 'auto',
                                            
                                        },
                                        {
                                            'type': 'Column',
                                            'size': 'stretch',
                                            'items': [
                                                {
                                                    'type': 'TextBlock',
                                                    'text': 'HELP!',
                                                    'weight': 'bolder',
                                                    'isSubtle': true
                                                },
                                                {
                                                    'type': 'TextBlock',
                                                    'text': '1. You see your recent transactions by typing \'My transactions\'',
                                                    'wrap': true
                                                },
                                                {
                                                    'type': 'TextBlock',
                                                    'text': '2. You exchange currency by typing \'Exchange Rate\'',
                                                    'wrap': true
                                                },
                                                {
                                                    'type': 'TextBlock',
                                                    'text': '3. You can make appointments by typing \'Make an appointment for \*specify time\*\'',
                                                    'wrap': true
                                                },
                                                {
                                                    'type': 'TextBlock',
                                                    'text': '4. You can view appointments by typing \'My appointments',
                                                    'wrap': true
                                                },
                                                {
                                                    'type': 'TextBlock',
                                                    'text': '5. Have a questions? Type \'I have a question\'',
                                                    'wrap': true
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    'actions': [ /* */ ]
                }
            };
            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
        }
    }
]).triggerAction({
    matches: 'GetHelp'
});

bot.dialog('ShowAppointments', [
    function (session, args, next) {
        session.dialogData.args = args || {};   
             
        if (!session.conversationData["accountno"]) {
            builder.Prompts.text(session, "Please enter your account number.");   
                         
        } else {
            next();
        }
    },
    function (session, results, next) {
        if (!isAttachment(session)) {

            if (results.response) {
                session.conversationData["accountno"] = results.response;
            }

            session.send("Retrieving your appoinments");
            appo.displayAppointments(session, session.conversationData["accountno"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
        }
    }
]).triggerAction({
    matches: 'ShowAppointments'
});

bot.dialog('GetAppointment', [
    function (session, args, next) {

        session.dialogData.args = args || {};        
        if (!session.conversationData["accountno"]) {
            builder.Prompts.text(session, "Enter a your account number for booking.");                
        } else {
            next(); // Skip if we already have this info.
        }
    },
    function (session, args, next) {
         
        if (!session.conversationData["accountno"]) {
            builder.Prompts.text(session, "When would you like a booking?");
        } else {
            next(); // Skip if we already have this info.
        }
    },
    function (session, results, next) {
        if(!isAttachment(session)){    
            if(results.response){
                session.conversationData["appointment"] = results.response;
            }     
            session.send('Your appointment has been made.');
            appo.newAppointments(session, session.conversationData["accountno"], session.conversationData["appointment"]); // <-- LINE WE WANT       
        }
    }
]).triggerAction({
    matches: 'GetAppointment'
});

bot.dialog('DeleteAppointment', [
    function (session, args, next) {
        
                session.dialogData.args = args || {};        
                if (!session.conversationData["accountno"]) {
                    builder.Prompts.text(session, "Enter a your account number for deleting.");                
                } else {
                    next(); // Skip if we already have this info.
                }
            },
            function (session, args, next) {
                 
                if (!session.conversationData["accountno"]) {
                    builder.Prompts.text(session, "Which booking would you like to delete?");
                } else {
                    next(); // Skip if we already have this info.
                }
            },
            function (session, results, next) {
                if(!isAttachment(session)){    
                    if(results.response){
                        session.conversationData["appointment"] = results.response;
                    }  
                       
                    session.send('Your appointment has been deleted.');
                    appo.deleteAppointments(session, session.conversationData["accountno"], session.conversationData["appointment"]); // <-- LINE WE WANT       
                }
            }
]).triggerAction({
    matches: 'DeleteAppointment'
});


bot.dialog('WelcomeIntent', function (session, args) {
    
    session.send("Welcome to BankBot! How may I help you?");

}).triggerAction({
    matches: 'WelcomeIntent'
});

bot.dialog('GetCurrency', [
    function (session, results, next) {
        if (!isAttachment(session)) {

            //session.send("Retrieving your recent transactions");
            oxr.set({
                app_id: 'bb201075b92641cca8cf4e2b0cc8c765'
                });
                
                oxr.latest(function(error) {
                
                if ( error ) {
                    console.log( 'ERROR loading data from Open Exchange Rates API! Error was:' )
                    console.log( error.toString() );
                    return false;
                }
                
                   
                        var country = builder.Prompts.text(session, "Please enter currency would you like to exchange to. (Base currency is NZD)");                                 
                    
                });
        }
    },
    function (session, results, next){
        if (results.response) {
            session.conversationData["country"] = results.response;
        }
        var country = session.conversationData["country"];

        fx.rates = oxr.rates;
        fx.base = oxr.base;

        var amount = fx(1).from('NZD').to(country).toFixed(6);
        var Moneytext = ('1 NZD in %s is: ' + amount, country);



        var card = {
            'contentType': 'application/vnd.microsoft.card.adaptive',
            'content': {
                '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
                'type': 'AdaptiveCard',
                'version': '1.0',
                'body': [
                    {
                        'type': 'Container',
                        'speak': '<s>Hello!</s><s>Are you looking for a flight or a hotel?</s>',
                        'items': [
                            {
                                'type': 'ColumnSet',
                                'columns': [
                                    {
                                        'type': 'Column',
                                        'size': 'auto',
                                        'items': [
                                            {
                                                'type': 'Image',
                                                'url': 'https://nebula.wsimg.com/7c5622972a4bb34364e85bb01c914a3a?AccessKeyId=9ED8A6723F994E922608&disposition=0&alloworigin=1',
                                                'size': 'medium',
                                                'style': 'person'
                                            }
                                        ]
                                    },
                                    {
                                        'type': 'Column',
                                        'size': 'stretch',
                                        'items': [
                                            {
                                                'type': 'TextBlock',
                                                'text': 'Currency Exchange!',
                                                'weight': 'bolder',
                                                'isSubtle': true
                                            },
                                            {
                                                'type': 'TextBlock',
                                                'text': '1 NZD is ' + amount + ' ' + country,
                                                'wrap': true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                'actions': [ /* */ ]
            }
        };
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        
    }
]).triggerAction({
    matches: 'GetCurrency'
});

bot.dialog('QnA', [
    function (session, args, next) {
        session.dialogData.args = args || {};
        builder.Prompts.text(session, "What is your question?");
    },
    function (session, results, next) {
        qna.talkToQnA(session, results.response);
    }
]).triggerAction({
    matches: 'QnA'
});




    function isAttachment(session) { 
        var msg = session.message.text;
        if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
            
            //call custom vision here later
            return true;
        }
        else {
            return false;
        }
    }


}
