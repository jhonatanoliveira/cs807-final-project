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
  },

  searchQuery: function(query, serviceId) {
    var bestNodes = [];
    if (this.userId) {

        // Breadth-first search
        var queue = [];
        var root = Nodes.findOne({serviceId: serviceId, parent: ""});
        var currentTreeNode = {_id: root._id, points: 0, confidence: 0};

        queue.push(currentTreeNode);

        var hasNewBestNode = false;
        while(queue.length > 0) {
            currentTreeNode = queue.pop();
            Nodes.find({serviceId: serviceId, parent: currentTreeNode._id}).forEach(function(post){
              var newPoints = 0;

              // Matching function: Using FuzzySet library from http://glench.github.io/fuzzyset.js/
              // This library computes a score based on the Levenshtein distance
              var CONFIDENCE_LEVEL = 0.2;

              var fuzzySet = FuzzySet([post.value]);
              var foundValue = fuzzySet.get(query);
              if (foundValue && foundValue[0][0] > CONFIDENCE_LEVEL) {
                newPoints = currentTreeNode.points + 1;

                hasNewBestNode = true;
              }

              var childTreeNode = {_id: post._id, points: newPoints, confidence: foundValue ? foundValue[0][0] : 0};
              queue.push(childTreeNode);

              // Update best nodes
              if(hasNewBestNode) {
                if ((bestNodes.length == 0) || (newPoints == bestNodes[0].points)) {
                  bestNodes.push(childTreeNode);
                } else if(newPoints > bestNodes[0].points) {
                  bestNodes = []
                  bestNodes.push(childTreeNode);
                }
                hasNewBestNode = false;
              }

            });
        }


        // Breadth-first search to get all descendants of the best nodes

        var data = [];

        var queue = [];

        for (var i = 0; i < bestNodes.length; i++) {
          var n = Nodes.findOne({serviceId: serviceId, _id: bestNodes[i]._id});
          var currentTreeNode = {_id: n._id, text: n.value, nodes: [], confidence: bestNodes[i].confidence};
          data.push(currentTreeNode);
          
          queue.push(currentTreeNode);
        }


        while(queue.length > 0) {
            currentTreeNode = queue.pop();
            Nodes.find({serviceId: serviceId, parent: currentTreeNode._id}).forEach(function(post){
                var childTreeNode = {_id: post._id, text: post.value, nodes: []};
                currentTreeNode.nodes.push(childTreeNode);
                queue.push(childTreeNode);
            });
        }

    }

    return data;
  }
}
);
