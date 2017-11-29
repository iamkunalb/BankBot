var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/1163e0c8-8352-499e-9d10-c0a281e06d3c/url?iterationId=b05e4317-bd33-43ff-bcc3-1edc5e66fcb2',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': 'e9ac2089340e4727b4a635c341a3773d'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Oops, please try again!');
    }
}