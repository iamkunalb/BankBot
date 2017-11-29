var rest = require('../API/RestClient');

exports.displayUserInfo = function getUserInfo(session, accountno){
    var url = 'http://kunalbankbot.azurewebsites.net/tables/BankBot';
    rest.getUserInfo(url, session, accountno, handleUserInfoResponse)
};

function handleUserInfoResponse(message, session, accountno) {
    var userinfoResponse = JSON.parse(message);
    var transactionA = [];
    for (var index in userinfoResponse) {
        var accountnoReceived = userinfoResponse[index].accountno;
        var transactions = userinfoResponse[index].transactions;
        var name = userinfoResponse[index].name;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (accountno.toLowerCase() === accountnoReceived.toLowerCase()) {
            //Add a comma after all favourite foods unless last one
            if(userinfoResponse.length - 1) {
                transactionA.push(transactions);
            } else {
                transactionA.push(transactions + ', ');
        }
    }        
}
    // Print all favourite foods for the user that is currently logged in
    session.send("Transactions were made from %s\'s account at: %s", name, transactionA);                
}

// function handleMoreInfoResponse(message, session, accountno) {
//     var userinfoResponse = JSON.parse(message);
//     var transactionA = [];
//     var dateA = [];
//     var priceA = [];
    
//     for (var index in userinfoResponse) {
//         var accountnoReceived = userinfoResponse[index].accountno;
//         var transactions = userinfoResponse[index].transactions;
//         var date = MoreinfoResponse[index].date;
//         var price = MoreinfoResponse[index].price;
        
    
//         //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
//         if (accountno.toLowerCase() === accountnoReceived.toLowerCase()) {
//             //Add a comma after all favourite foods unless last one
//             if(userinfoResponse.length - 1) {
//                 transactionA.push(transactions);
//                 dateA.push(date);
//                 priceA.push(price);
//             }
//             else {
//                 transactionA.push(transactions + ', ');
//                 dateA.push(date + ', ');
//                 priceA.push(price + ', ');
//             }
//         }        
//     }
    
    // Print all favourite foods for the user that is currently logged in
    //session.send("%s, %s, %s", transactonA, dateA, priceA);                
    
   // }


// exports.sendFavouriteFood = function postFavouriteFood(session, username, favouriteFood){
//     var url  = 'http://myfoodbotmsa.azurewebsites.net/tables/FoodBot';
//     rest.postFavouriteFood(url, username, favouriteFood);
// };

// exports.deleteFavouriteFood = function deleteFavouriteFood(session,username,favouriteFood){
//     var url  = 'http://myfoodbotmsa.azurewebsites.net/tables/FoodBot';


//     rest.getFavouriteFood(url,session, username,function(message,session,username){
//      var   allFoods = JSON.parse(message);

//         for(var i in allFoods) {
        
//             console.log(favouriteFood)
//             console.log(username)
//             if (allFoods[i].favouriteFood === favouriteFood && allFoods[i].username === username) {

//                 console.log(allFoods[i]);

//                 rest.deleteFavouriteFood(url,session,username,favouriteFood, allFoods[i].id, handleDeletedFoodResponse)

//             }
//         }


//     });


// };

// function handleDeletedFoodResponse(body, session, username, favouriteFood) {
//     console.log(body);
//     console.log(username);
//     console.log(favouriteFood);
// }

// function handleFavouriteFoodResponse(message, session, username) {
//     var favouriteFoodResponse = JSON.parse(message);
//     var allFoods = [];
//     for (var index in favouriteFoodResponse) {
//         var usernameReceived = favouriteFoodResponse[index].username;
//         var favouriteFood = favouriteFoodResponse[index].favouriteFood;

//         //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
//         if (username.toLowerCase() === usernameReceived.toLowerCase()) {
//             //Add a comma after all favourite foods unless last one
//             if(favouriteFoodResponse.length - 1) {
//                 allFoods.push(favouriteFood);
//             }
//             else {
//                 allFoods.push(favouriteFood + ', ');
//             }
//         }        
//     }

//     // Print all favourite foods for the user that is currently logged in
//     session.send("%s, your favourite foods are: %s", username, allFoods);                

// }