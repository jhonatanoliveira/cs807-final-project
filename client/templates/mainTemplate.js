var mic;
var toggleMic = false;

Template.mainTemplate.onRendered(function(){

    mic = new Wit.Microphone(document.getElementById("microphone"));

    mic.onready = function () {
        console.log("Microphone is ready.");
    };
    mic.onaudiostart = function () {
        console.log("Recording...");
    };
    mic.onaudioend = function () {
        console.log("Recordered.");
    };
    mic.onresult = function (intent, entities) {
        console.log("Results from Wit: ");
        console.log(intent);
        console.log(entities);

        handleIntent(intent, entities, function(error, result){
            if (error) {
                bootbox.alert("Error while processing your query. Please, try again.");
            } else {
                console.log("Results from Sys: ");
                console.log(result);

                if (typeof(result)=="object") {
                    // TODO: better way of filtering multiple results
                    // result = [result.pop()];
                    $("#result-tree").treeview("remove");
                    $("#result-tree").treeview({data: result, showBorder: false});
                }
            }
        });
    };
    mic.onerror = function (err) {
        console.log("Error: " + err);
    };
    mic.onconnecting = function () {
        console.log("Microphone is connecting.");
    };
    mic.ondisconnected = function () {
        console.log("Microphone is disconnected.");
    };

    mic.connect("XHPI23PCO7EGYLQNZFPID3THFS5GVDOL");
});


Template.mainTemplate.events({
    "click #microphone": function(e) {
        if (toggleMic) {
            mic.stop();
            toggleMic = false;
        } else {
            mic.start();
            toggleMic = true;
        }
    }
});
