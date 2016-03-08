Meteor.methods(
{
  removeAllNodes: function(serviceId) {
    if (this.userId) {
      Nodes.remove({serviceId: serviceId});
      return true;
    } else {
      return false;
    }
  },

  getDataTree: function(serviceId) {
    var data = [];

    if (this.userId) {

        // Breadth-first search
        var queue = [];
        var root = Nodes.findOne({serviceId: serviceId, parent: ""});
        var currentTreeNode = {"text": root.value, _id: root._id, nodes: []};
        data.push(currentTreeNode);

        queue.push(currentTreeNode);

        while(queue.length > 0) {
            currentTreeNode = queue.pop();
            Nodes.find({serviceId: serviceId, parent: currentTreeNode._id}).forEach(function(post){
                var childTreeNode = {"text": post.value, _id: post._id, nodes: []};
                currentTreeNode.nodes.push(childTreeNode);
                queue.push(childTreeNode);
            });
        }
    }
    return data;
  },

  removeBranch: function(nodeId, serviceId) {
    if (this.userId) {
        // Breadth-first search
        var queue = [];
        var currentTreeNode = nodeId;

        queue.push(currentTreeNode);

        while(queue.length > 0) {
            currentTreeNode = queue.pop();
            Nodes.remove({_id: currentTreeNode, serviceId: serviceId});
            Nodes.find({serviceId: serviceId, parent: currentTreeNode}).forEach(function(post){
                var childTreeNode = post._id;
                queue.push(childTreeNode);
            });
        }
      return true;
    } else {
      return false;
    }
  }
}
);
