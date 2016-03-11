function drawTree() {
    Meteor.call("getDataTree", Session.get("serviceId"), function(error, result){
        if (error) {
            bootbox.alert("Error retrieving the nodes. Please, try again.")
        } else {
            $('#tree').treeview({data: result});
        }
    });
}



Template.serviceTemplate.onRendered(function(){
    var data = []
    drawTree();
});



Template.serviceTemplate.events({
    "click .add-child": function(e) {
        var selectedNodes = $('#tree').treeview('getSelected');
        if (selectedNodes.length > 0 ) {
            var selectedNode = selectedNodes[0];

            bootbox.prompt("What is the value of the node?", function(result) {                
                if (result) {                                             
                    Nodes.insert({serviceId: Session.get("serviceId"), parent: selectedNode._id, value: result});
                    drawTree();
                }
            });
        } else {
            bootbox.alert("Please, select a node first.");
        }
    },

    "click .remove-branch": function(e) {
        var selectedNodes = $('#tree').treeview('getSelected');
        if (selectedNodes.length > 0 ) {
            var selectedNode = selectedNodes[0];

            bootbox.confirm("Are you sure that you want to remove this node and ALL its descendants?", function(result) {                
                if (result) {                                             
                    Meteor.call("removeBranch", selectedNode._id, Session.get("serviceId"));
                    drawTree();
                }
            });
        } else {
            bootbox.alert("Please, select a node first.");
        }
    },

    "click .edit-value": function(e) {
        var selectedNodes = $('#tree').treeview('getSelected');
        if (selectedNodes.length > 0 ) {
            var selectedNode = selectedNodes[0];

            bootbox.prompt({
                title: "What is the NEW value of the node?",
                value: selectedNode.text,
                callback: function(result) {
                    if (result) {
                        Nodes.update(selectedNode._id, {$set: {value: result}});
                        drawTree();
                    }
                }
            });
        } else {
            bootbox.alert("Please, select a node first.");
        }
    },

    "submit .search-form": function(e) {
        e.preventDefault();
        if (e.target.query.value.length > 0) {
            Meteor.call("searchQuery", e.target.query.value, function(error, result){
                if (error) {
                    bootbox.alert("Problem while processing query. Please, try again.");
                } else {
                    $('#search-tree').treeview(
                        {
                            data: result,
                            showBorder: false
                        }
                        );
                }
            });
        } else {
            bootbox.alert("Please, type in a query.");
        }
    }
});