DataServiceHandler = {
    "contacts": function(entities, callback) {

        var r = "";

        for (var k in entities) {
            var e = entities[k];

            if (!(e instanceof Array)) {
                r += kv(k, e.value);
            } else {
                for (var i = 0; i < e.length; i++) {
                    r += kv(k, e[i].value);
                }
            }
        }

        Meteor.call("searchQuery", r, function(error, result){
            callback(error, result);
        });
    }
}


handleIntent = function(intent, entities, callback) {
    var service = Services.findOne({name: intent});

    if (service.type == "data") {
        if (service.name in DataServiceHandler) {
            return DataServiceHandler[intent](entities, callback);
        } else {
            return -1;
        }
    } else if (service.type == "external") {

    }
}

function kv (k, v) {
    if (toString.call(v) !== "[object String]") {
        v = JSON.stringify(v);
    }
    return v + " ";
}