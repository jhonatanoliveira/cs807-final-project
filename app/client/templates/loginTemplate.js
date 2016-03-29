Template.loginTemplate.events({
    "submit .login": function(e) {
        e.preventDefault();
        Meteor.loginWithPassword(e.target.username.value, e.target.password.value, function(error){
            if (error) {
                bootbox.alert("Login failed. Please, try again.");
                e.target.username.value = "";
                e.target.password.value = "";
            } else {
                Router.go("/admin");
            }
        });
    }
})