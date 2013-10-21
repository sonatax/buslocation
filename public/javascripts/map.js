var ymap;
var lastMark = [];
var lastLine = [];
var arrayMark = [];
var arrayBus = [];
var stopMark = [];
var arrayLine = [];
var latlngs = [];

window.onload = function(){
    resizeMapSize();
    ymap = new Y.Map("map", {
        configure : {
            doubleClickZoom : true,
            scrollWheelZoom : true,
            singleClickPan : true,
            dragging : true
        }
    });

    stylemaplayer = new Y.StyleMapLayer("simple");
    layerset = new Y.LayerSet("スタイル地図", [stylemaplayer]);
    ymap.addLayerSet("stylemap",layerset);
    ymap.drawMap(new Y.LatLng(35.66572, 139.73100), 15, 'stylemap');
    ymap.addControl(new Y.LayerSetControl);
    var slider = new Y.SliderZoomControlVertical;
    var size = new Y.Size(0, 50);
    var sliderpos = new Y.ControlPosition(Y.ControlPosition.TOP_LEFT, size)
    ymap.addControl(slider, sliderpos);
    ymap.addControl(new Y.ScaleControl);
    ymap.addControl(new Y.CenterMarkControl);
}
window.onresize = function() {
    resizeMapSize();
}

function setPosition(pos, id, num, last)
{
    // old position delete
    if(lastMark.length > 0) {
        for(ilast=0;ilast<lastMark.length;ilast++){
            if(document.routeid.elements[id].checked) {
                ymap.removeFeature(lastMark[id]);
            }
        }
    }
    if(lastLine.length > 0) {
        for(ilast=0;ilast<lastLine.length;ilast++){
            if(document.routeid.elements[id].checked) {
                ymap.removeFeature(lastLine[id]);
            }
        }
    }

    // add position
    resultPos = pos.split(",");
    if(id > 3) {
        var busicon = new Y.Icon('/images/busB1.gif');
    } else {
        var busicon = new Y.Icon('/images/busT1.gif');
    }

    // disp marker, line
    arrayBus[id] = [];
    lastMark[id] = [];
    lastLine[id] = [];
    if(!latlngs[id]) {
        latlngs[id] = [];
    }
    latlngs[id].push(new Y.LatLng(resultPos[1],resultPos[0]));
    polyline = new Y.Polyline(latlngs[id]);
    arrayLine[id] = polyline;
    lastLine[id] = polyline;

    marker = new Y.Marker(new Y.LatLng(resultPos[1],resultPos[0]), {icon: busicon});
    arrayBus[id] = marker;
    lastMark[id] = marker;
    ymap.addFeatures(arrayBus);
    ymap.addFeatures(arrayLine);

    // remove line when a bus returned to start position
    if(num == last) {
        latlngs[id] = [];
    }
}

function setBusStop(aBusStop, id)
{
    if(aBusStop) {
        var stopicon = new Y.Icon('/images/busStop.gif', {infoWindowAnchor: new Y.Point(40, 10)});
        arrayMark[id] = [];
        for(var i=0; i<aBusStop.item.length; i++) {
            stopPoint = aBusStop.item[i].split(",");
            stopMark[i] = new Y.Marker(new Y.LatLng(stopPoint[1],stopPoint[0]), {icon: stopicon});
            if(stopPoint[2]) {
                stopMark[i].bindInfoWindow(stopPoint[2]);
            } else {
                stopMark[i].bindInfoWindow('testtesttest');
            }
            arrayMark[id].push(stopMark[i]);
            //console.log(arrayMark[id]);
            ymap.addFeature(stopMark[i]);
        }
    }
}

function disableBusStop(id)
{
    for(var i=0; i<arrayMark[id].length; i++) {
        stopPoint = arrayMark[id][i];
        //stopMark = new Y.Marker(new Y.LatLng(stopPoint[1],stopPoint[0]), {icon: stopicon});
        ymap.removeFeature(stopPoint);
        ymap.removeFeature(lastMark[id]);
    }
}

function getBrowserHeight()
{
    if ( window.innerHeight ) {
        return window.innerHeight;
    } else if ( document.documentElement && document.documentElement.clientHeight != 0 ) {
        return document.documentElement.clientHeight;
    } if ( document.body ) {
        return document.body.clientHeight;
    }
    return 0;
}
function getBrowserWidth() {  
    if ( window.innerWidth ) {
        return window.innerWidth; 
    } else if ( document.documentElement && document.documentElement.clientWidth != 0 ) {
        return document.documentElement.clientWidth; 
    } else if ( document.body ) {
        return document.body.clientWidth;
    }
    return 0;  
}  

function resizeMapSize() 
{
    var dispmap = document.getElementById("map");
    var mapw = getBrowserWidth();
    var maph = getBrowserHeight();
    var mapcss = "width:"+mapw+"px; height:"+maph+"px;";
    dispmap.style.cssText = mapcss;
}

