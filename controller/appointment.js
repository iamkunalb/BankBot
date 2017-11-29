var rest = require('../API/RestClient');

exports.displayAppointments = function GetAppointment(session, accountno){
    var url = 'http://kunalbankbot.azurewebsites.net/tables/BankBot';
    rest.GetAppointment(url, session, accountno, handleAppointments)
};

exports.newAppointments = function postAppointment(session, accountno, appointment){
    var url = 'http://kunalbankbot.azurewebsites.net/tables/BankBot';
    rest.postAppointment(url, accountno, appointment);
};

exports.deleteAppointments = function deleteAppointment(session,accountno,appointment){
    var url = 'http://kunalbankbot.azurewebsites.net/tables/BankBot';
    

    rest.GetAppointment(url,session, accountno,function(message,session,accountno){
     var   allstuff = JSON.parse(message);

        for(var i in allstuff) {
            if (allstuff[i].appointment === appointment && allstuff[i].accountno === accountno) {

                rest.deleteAppointment(url,session,accountno,appointment, allstuff[i].id, handleDeleted)

            }
        }


    });


};

function handleDeleted(body, session, accountno, appointment) {
    console.log('Deleted');
}


function handleAppointments(message, session, accountno) {
    var appointmentResponse = JSON.parse(message);
    var appointmentA = [];
    for (var index in appointmentResponse) {
        var accountnoReceived = appointmentResponse[index].accountno;
        var appointment = appointmentResponse[index].appointment;
        var name = appointmentResponse[index].name;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (accountno.toLowerCase() === accountnoReceived.toLowerCase()) {
            //Add a comma after all favourite foods unless last one
            if(appointmentResponse.length - 1) {
                appointmentA.push(appointment);
            } else {
                appointmentA.push(appointment + ', ');
        }
    }        
}
    // Print all favourite foods for the user that is currently logged in
    session.send("%s, your current appointments are: %s", name, appointmentA);             
}