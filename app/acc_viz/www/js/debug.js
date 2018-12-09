var debug = {

  	debugLength: 0,

    print: function (message, type) {
        message = (typeof (message) == 'object') ? JSON.stringify(message) : message;
        var messageColor = "black";
        switch (type) {
            case "error":
                messageColor = "red";
                break;
            case "debug":
                    messageColor = "blue";
                    break;
            case "success":
                messageColor = "green";
                break;
        }
        var messageLine = '<div>' +
            '<div class="timestamp">' + moment().format() + '</div>' +
            '<div style="color: ' + messageColor + ';">' + message + '</div>' +
            '</div>';
        // if (this.debugLength > 5)
        // {
        //   $("#debugList").prev().remove();
        // } else {
        //   debugLength++;
        // }

        $('#debugList').prepend(messageLine);

    },
    log: function (message, type) {
        console.log(message);
        this.print(message, type);
    },
    clear: function () {
        $('#debugList').empty();
    }
}