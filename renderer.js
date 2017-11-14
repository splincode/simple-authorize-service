var Dialogs = require('dialogs');
var dialogs = Dialogs({
 ok: "Подтвердить",
 cancel: "Отмена"
});

window.addEventListener("message", function (event) {

    let messageEvent = JSON.parse(event.data);
    console.info(messageEvent);

    switch (messageEvent.type) {
        case "close":
            window.close()
        break;

        case "get-password":

        	var myFrame = document.getElementById("myFrame");

        	dialogs.prompt(
        		"Парольное ограничение (по умолчанию, наличие в начале кирилицы, затем латинские буквы)", 
        		'^([а-яё]+[a-z]+)$', 
        		function(result) {
        			myFrame.contentWindow.postMessage(JSON.stringify({
        				type: "set-password", 
        				username: messageEvent.username,
        				regexp: result
        			}), "*");
        	});



    	    
        break;
    }

}, false);