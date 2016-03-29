Template.mapTemplate.helpers({
    maps: function() {
        return Maps.find({});
    }
});

Template.mapTemplate.events({
    "click .add-map": function(e) {
        bootbox.prompt("What is the name of this new map?", function(result){
            if (result) {
                Maps.insert({"name": result});
            }
        });
    },

    "click .map-btn": function(e) {
        Router.go("/admin/map/" + $(e.target).val());
    },

    "submit .map-add-form": function(e) {
        e.preventDefault();
        Maps.update(e.target.mapId.value, {$set: {url: e.target.mapAdd.value}});
    },

    "submit .map-grid-size-form": function(e) {
        e.preventDefault();
        Maps.update(e.target.mapId.value, {$set: {gridW: e.target.gridW.value, gridH: e.target.gridH.value}});
    },

    "submit .map-image-size-form": function(e) {
        e.preventDefault();
        Maps.update(e.target.mapId.value, {$set: {imageW: e.target.imageW.value, imageH: e.target.imageH.value}});
    },

    "submit .map-block-size-form": function(e) {
        e.preventDefault();
        Maps.update(e.target.mapId.value, {$set: {blockSize: e.target.blockSize.value}});
    },

    "click .refresh-map": function(e) {
        refreshMap($(e.target).attr("value"));
    }
})


function refreshMap(mapId) {
    $("#drawing").empty();

    var mapInfo = Maps.findOne(mapId);
    var draw = SVG('drawing').size(mapInfo.gridW, mapInfo.gridH);

    var image = draw.image(mapInfo.url).size(mapInfo.imageW, mapInfo.imageH);
    image.attr("x", 0);
    image.attr("y", 0);

    var qntBlocksHor = Math.round(mapInfo.gridW / mapInfo.blockSize);
    var qntBlocksVer = Math.round(mapInfo.gridH / mapInfo.blockSize);

    console.log(qntBlocksHor)
    console.log(qntBlocksVer)

    for (var i = 0; i < qntBlocksHor; i++) {
        for (var j = 0; j < qntBlocksVer; j++) {
            // Def
            var rect = draw.rect(mapInfo.blockSize, mapInfo.blockSize);
            rect.fill({ color: '#AFAFAF', opacity: 0.1 });
            rect.stroke({ color: '#858585', opacity: 0.8, width: 2 })
            rect.attr("x", j*mapInfo.blockSize);
            rect.attr("y", i*mapInfo.blockSize);
            // Events
            
        }
    }
}