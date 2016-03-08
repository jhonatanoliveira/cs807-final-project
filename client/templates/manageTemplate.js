Template.manageTemplate.helpers({
    services: function() {
        return Services.find({});
    }
})


Template.manageTemplate.events({
    "click .save-service": function(e) {
        var serviceName = $("#service-name").val();
        var serviceId = Services.insert({"name": serviceName, "type": $("[name='service-type']:checked").val() });
        $("#service-name").val("");
        $("#myModal").modal("hide");

        Nodes.insert({serviceId: serviceId, value: serviceName, parent: ""});
    },

    "click .remove-service": function(e) {
        var serviceId = this._id;
        bootbox.confirm("Do you really want to remove service '" + this.name + "' and ALL related nodes?", function(answer){
            if (answer) {
                Services.remove(serviceId);
                Meteor.call("removeAllNodes", serviceId);
            }
        })
    }
});