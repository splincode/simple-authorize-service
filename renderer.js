window.addEventListener("message", function (event) {
    let messageEvent = JSON.parse(event.data);
    console.info(messageEvent);

    switch (messageEvent.type) {
        case "close":
            //window.close()
            break;
    }

}, false);