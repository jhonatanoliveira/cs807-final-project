Meteor.startup(function(){
    var user = Accounts.findUserByUsername("admin");
    if (!user) {
        Accounts.createUser({"username": "admin", "password": "cs8072016"});
    }
});