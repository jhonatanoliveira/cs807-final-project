Template.adminLayout.helpers({
    services: function() {
        return Services.find({});
    }
});


Template.adminLayout.events({
    "click .logout": function(e) {
        e.preventDefault();
        Meteor.logout();
    }
});