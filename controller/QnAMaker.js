var rest = require('../API/Restclient');

exports.talkToQnA = function postQnAResults(session, question){
    var url = 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/5aa23ab9-15c3-448d-bdcd-652e158a5d83/generateAnswer';
    rest.postQnAResults(url, session, question, handleQnA)
};

function handleQnA(body, session, question) {
    session.send(body.answers[0].answer);
};
