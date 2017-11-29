var rest = require('../API/Restclient');
var builder = require('botbuilder');

//Calls 'getNutritionData' in RestClient.js with 'getFoodNutrition' as callback to get ndbno of food
exports.displayExchange = function getNutritionData(changeTo, session){
    var url = "https://api.fixer.io/latest?base=NZD";

    rest.getExchangeData(url, session,changeTo, getExchange);
}

function getExchange(message, changeTo, session){
    var exchangeList = JSON.parse(message);
    var changeTO = exchangeList.list.item[0].changeTO;
    var url = "https://api.fixer.io/latest?symbols="+changeTO;
    
    rest.getExchangeData(url, session, changeTo, displayExchange);

}

function displayExchange(message, changeTo,session){
    //Parses JSON
    var foodNutrition = JSON.parse(message);
    
        //Adds first 5 nutrition information (i.e calories, energy) onto list
        var nutrition = foodNutrition.report.food.nutrients;
        var nutritionItems = [];
        for(var i = 0; i < 5; i++){
            var nutritionItem = {};
            nutritionItem.title = nutrition[i].name;
            nutritionItem.value = nutrition[i].value + " " + nutrition[i].unit;
            nutritionItems.push(nutritionItem);
        }

    //Displays nutrition adaptive cards in chat box 
    session.send(new builder.Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "0.5",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": changeTo.charAt(0).toUpperCase() + changeTo.slice(1),
                            "size": "large"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Nutritional Information"
                        }
                    ]
                },
                {
                    "type": "Container",
                    "spacing": "none",
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "FactSet",
                                            "facts": nutritionItems
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }));
}