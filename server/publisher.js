Meteor.publish("services", function () {
    return Services.find();
});

Meteor.publish("maps", function(){
    return Maps.find();
});

Meteor.publish("nodes", function(serviceId){
    return Nodes.find({serviceId: serviceId});
});
