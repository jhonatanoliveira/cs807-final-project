// *** Routes ***
Router.route("/", function(){

    this.wait(Meteor.subscribe("services"));

    this.layout("clientLayout");

    if (this.ready()) {
        this.render("mainTemplate")
    } else {
        this.render("loadingTemplate");
    }
});


Router.route("/login", function(){
    this.layout("clientLayout");
    this.render("loginTemplate")
});

Router.route("/admin", function(){

    this.wait(Meteor.subscribe("services"));

    this.layout("adminLayout");

    if (this.ready()) {
        this.render("adminTemplate");
    } else {
        this.render("loadingTemplate");
    }
});

Router.route("/admin/manage", function(){

    this.wait(Meteor.subscribe("services"));
    this.layout("adminLayout");

    if (this.ready()) {
        this.render("manageTemplate");
    } else {
        this.render("loadingTemplate");
    }
});

Router.route("/admin/service/:_id", function(){

    var serviceId = this.params._id;
    Session.set("serviceId", serviceId);

    this.wait([Meteor.subscribe("nodes", serviceId), Meteor.subscribe("services")]);

    this.layout("adminLayout");

    if (this.ready()) {
        this.render("serviceTemplate", {
            data: function() {
                return Services.findOne({_id: serviceId});
            }
        });
    } else {
        this.render("loadingTemplate");
    }

});

Router.route("/admin/map/:_id", function(){

    this.wait([Meteor.subscribe("maps"), Meteor.subscribe("services")]);

    var mapId = this.params._id;
    this.layout("adminLayout");
    if (this.ready()) {
        this.render("mapTemplate", {
            data: function() {
                return Maps.findOne({_id: mapId});
            }
        });
    } else {
        this.render("loadingTemplate");
    }
});


// *** Hooks ***
Router.onBeforeAction(function () {

    if (!Meteor.userId()) {
        // if the user is not logged in, render the Login template
        this.render('loginTemplate');
    } else {
        // otherwise don't hold up the rest of hooks or our route/action function from running
        this.next();
    }
    }
    , {
        // only: ['admin', "/admin/manage"]
        except: []
    }
);