Services = new Mongo.Collection("services");

Services.allow({
    insert: function(userId, doc) {
        return userId;
    },
    remove: function(userId, doc) {
        return userId;
    }
})


Nodes = new Mongo.Collection("nodes");

Nodes.allow({
    insert: function(userId, doc) {
        return userId;
    },
    remove: function(userId, doc) {
        return userId;
    },
    update: function(userId, doc) {
        return userId;
    }
})