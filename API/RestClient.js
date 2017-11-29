var request = require('request')

exports.getUserInfo = function getData(url, session, accountno, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, accountno);
        }
    });
};

exports.GetAppointment = function getData(url, session, accountno, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, accountno);
        }
    });
};

exports.postAppointment = function sendData(url, accountno, appointment){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : accountno,
            "favouriteFood" : appointment
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};

exports.deleteAppointments = function deleteData(url,session, accountno ,appointment, id, callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
            callback(body,session,accountno, appointment);
        }else {
            console.log(err);
            console.log(res);
        }
    })

};

exports.getExchangeData = function getData(url, session, changeTo, callback){
    
        request.get(url, function(err,res,body){
            if(err){
                console.log(err);
            }else {
                callback(body, changeTo, session);
            }
        });
    };

    exports.postQnAResults = function getData(url, session, question, callback){
        var options = {
            url: url,
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': '31d6015d8aeb431b8254070e4f642765',
                'Content-Type':'application/json'
            },
            json: {
                "question" : question
            }
          };
      
          request(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                callback(body, session, question);
            }
            else{
                console.log(error);
            }
          });
      };