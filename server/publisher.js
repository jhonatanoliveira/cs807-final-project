Meteor.publish("services", function () {
    return Services.find();
});


Meteor.publish("nodes", function(serviceId){
    return Nodes.find({serviceId: serviceId});
});